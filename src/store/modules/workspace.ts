import {defineStore} from 'pinia'
import {ref} from "vue";

// 假设你需要传递一个用户ID作为参数

export const useWorkspaceStore = defineStore ('workspace', {
  state: () => ({
    progress: 0,
    socket: {} as WebSocket | null,
    isConnected: ref(false),
    connectUrl: '',
    sockettimeout: 6000,
    serverTimeoutObj: 0,
    isFinish:true,
    fileList:[],
    uploadSpaceInfo:{
      name:'',
      id:''
    },
    progressShow:false,
    //组织架构数据
    deptData:[],
    //上传文件对象添加容器，里面结构为{‘spaceId’:[文件list]}
    uploadFileObj:{}
  }),

  //异步|逻辑的地方
  actions: {
    // 连接WebSocket服务器
    connect (url: string) {
      try {
        console.log (url, 'url')
        //获取ref值
        this.connectUrl = url;
        this.socket = new WebSocket (url);
        this.socket.onopen = () => {
          this.isConnected = true;
          console.log (this.socket)
        };
        
        this.socket.onmessage = (event) => {
          console.log (this.socket)
          console.log ('Message received:', JSON.parse (event.data));
          const data = JSON.parse (event.data)
          //管理页获取文件生成进度
          if (url.indexOf ('knowledge/upload_file') > - 1) {
            this.progress = parseInt(data.progress)
            if(this.progress == 100){
              this.isFinish = true
              this.fileList = []
              this.close()
            }
          }
        };
        
        this.socket.onerror = (error) => {
          console.log ('WebSocket error', error);
          //socket断开 需要重连
          if (this.isConnected) {
            this.connect (url)
            this.isConnected = false;
          }

        };
        
        this.socket.onclose = () => {
          if (this.isConnected) {
            this.connect (url)
            this.isConnected = false;
          }
        };
      } catch (e) {
        console.error (e)
      }
    },
    
    //发送消息
    sendMessage (message: any) {
      if (this.socket && this.isConnected) {
        this.socket.send (JSON.stringify (message));

        console.log (message, 'yyu')
      } else {
        console.log ("err")
        console.log (this.socket);
        console.log (this.isConnected);
      }
    },
    websocketreset () {
      if (this.serverTimeoutObj) {
        clearTimeout (this.serverTimeoutObj)
      }
      if (this.isConnected) {
        //超过四秒没收到消息，重新连接
        this.serverTimeoutObj = setTimeout (() => {
          //超时关闭
          console.log ("超时关闭")
          this.connect (this.connectUrl)
        }, this.sockettimeout);
      }
      
    },
    //关闭
    close () {
      // @ts-ignore
      if (this.socket.readyState == 1) {
        this.isConnected = false;
        // @ts-ignore
        this.socket.close ();
        console.log("websocket 关闭")
        // this.socket = null;
      }
      if (this.serverTimeoutObj) {
        clearTimeout (this.serverTimeoutObj)
      }
    },

  },
  
  getters: {
 
  }
})
