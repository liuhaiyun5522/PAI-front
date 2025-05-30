import {initMinio, putObject} from 'minio-js';
import useWebSocketStore from '@/store';
const {webSocket} = useWebSocketStore ();
import {useWorkspaceStore} from "@/store/modules/workspace";
const $workspaceStore = useWorkspaceStore ();
// 定义 URL 字符串
const urlString = import.meta.env.VITE_FILE_SEVER_ENV;
// 创建一个 URL 对象
const urlObj = new URL (urlString);
// 提取主机名（IP 地址或域名）
const hostname = urlObj.hostname;
// 提取端口号（如果没有指定端口号，默认端口号会是空字符串）
const port = urlObj.port?Number (urlObj.port):'';
const changeFilechat = (event, data) => {
  console.log (event)
  const file = event.file
  console.log (file)
  let reader = new FileReader ()
  reader.readAsArrayBuffer (file)
  reader.onload = function (e) {
    let res = e.target.result
    //初始化
    initMinio ({
      endPoint: hostname, // minio的ip，直接替换自己的即可
      port: port, // 端口号，若地址为类似test.minio.com,就不必写端口号
      // useSSL: urlObj.protocol=='https', // 是否使用ssl
      accessKey: 'minioadmin', // 登录的accessKey
      secretKey: 'minioadmin',// 登录的secretKey
    })
    //上传
    putObject ('filechat', res, file.name, function (err, data) { //第一个桶名，第二个文件，第三个文件名字，第四个回调函数
      if (err) {
        console.log (err)
      } else {
        console.log ('上传完成')
        console.log (err, data)
        let bucket = {
          "bucket_name": "filechat",
          "object_name": file.name,
          "userid": localStorage.getItem ('userId')
        }
        webSocket.FileUpload (bucket)
      }
      
    })
  }
}
const workspaceUploadFile = (event, fileData,spaceId) => {
  return new Promise((resolve,reject) => {
    const file = event.file
    let reader = new FileReader ()
    reader.readAsArrayBuffer (file)
    reader.onload = function (e) {
      let res = e.target.result
      //初始化
      initMinio ({
        endPoint: hostname, // minio的ip，直接替换自己的即可
        port: port, // 端口号，若地址为类似test.minio.com,就不必写端口号
       // useSSL: urlObj.protocol=='https', // 是否使用ssl
        accessKey: 'minioadmin', // 登录的accessKey
        secretKey: 'minioadmin',// 登录的secretKey
      })
      //上传
      putObject ('work-space', res, `${spaceId}/${file.name}`, function (err, data) { //第一个桶名，第二个文件，第三个文件名字，第四个回调函数
        if (err) {
          console.log (err)
          reject(err);
        } else {
          console.log ('上传完成')
          $workspaceStore.fileList.push (fileData)
          console.log ($workspaceStore.fileList)
          resolve(data);
        }
        
      })
    
    }
  })
 
}
export {changeFilechat, workspaceUploadFile}
