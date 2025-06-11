import { initMinio, putObject } from 'minio-js';
import useWebSocketStore from '@/store';
const { webSocket } = useWebSocketStore();

const changeFilechat=(event, data)=> {
    console.log(event)
    const file = event.file
    console.log(file)
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function (e) {
        let res = e.target.result
        //初始化
        initMinio({
            endPoint: '13.112.150.251', // minio的ip，直接替换自己的即可
            port: 9000, // 端口号，若地址为类似test.minio.com,就不必写端口号
            useSSL: false, // 是否使用ssl
            accessKey: 'minioadmin', // 登录的accessKey
            secretKey: 'minioadmin',// 登录的secretKey
        })
        //上传
        putObject('filechat', res, file.name, function (err, data) { //第一个桶名，第二个文件，第三个文件名字，第四个回调函数
            if (err) {
                console.log(err)
            }
            else {
                console.log('上传完成')
                console.log(err,data)
                let bucket = {
                    "bucket_name":"filechat",
                    "object_name":file.name,
                    "userid":localStorage.getItem('userId')
                }
                webSocket.FileUpload(bucket)
                // let result:any = reqLogin(JSON.parse(JSON.stringify(data)));

            }
            // let aaa = 
        })
    }
}
const KnowledgeUploadFile=(event, data)=> {
    // console.log(webSocket.serverUrl,'77')
    console.log(event)
    const file = event.file
    console.log(file)
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function (e) {
        let res = e.target.result
        //初始化
        initMinio({
            endPoint: '13.112.150.251', // minio的ip，直接替换自己的即可
            port: 9000, // 端口号，若地址为类似test.minio.com,就不必写端口号
            useSSL: false, // 是否使用ssl
            accessKey: 'minioadmin', // 登录的accessKey
            secretKey: 'minioadmin',// 登录的secretKey
        })
        //上传
        putObject('knowledge-file', res, file.name, function (err, data) { //第一个桶名，第二个文件，第三个文件名字，第四个回调函数
            if (err) {
                console.log(err)
            }
            else {
                console.log('上传完成')
                console.log(err,data)
            }
        })

    }
}
const proposalUploadFile=(event, data)=> {
    // console.log(webSocket.serverUrl,'77')
    console.log(event)
    const file = event.file
    console.log(file)
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function (e) {
        let res = e.target.result
        //初始化
        initMinio({
            endPoint: '13.112.150.251', // minio的ip，直接替换自己的即可
            port: 9000, // 端口号，若地址为类似test.minio.com,就不必写端口号
            useSSL: false, // 是否使用ssl
            accessKey: 'minioadmin', // 登录的accessKey
            secretKey: 'minioadmin',// 登录的secretKey
        })
        //上传
        putObject('tender-document', res, file.name, function (err, data) { //第一个桶名，第二个文件，第三个文件名字，第四个回调函数
            if (err) {
                console.log(err)
            }
            else {
                console.log('上传完成')
                console.log(err,data)
            }
        })

    }
}
export {changeFilechat,KnowledgeUploadFile,proposalUploadFile}