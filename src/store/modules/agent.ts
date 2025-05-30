import {defineStore} from 'pinia'
import {ref} from 'vue';

export const useAgentStore = defineStore ('agent', {
  state: () => ({
    socket: null as WebSocket | null,
    //websocket是否连接中
    isConnected: ref (false),
    //对话连接是否连接，并正常返回内容
    isChatConnected: ref (false),
    //报告连接是否连接，并正常返回内容
    isReportConnected: ref (false),
    //对话是否结束并且成功
    isFinish: ref (false),
    //输入框发送内容
    inputMessage: '',
    //loading循环定时器
    loading: false,
    sourceNumber: 0,
    answer: {
      content: "",
      logs: [],
    },
    urlList: [], //全网检索
    spaceList: [],//workspace 检索
    type2: [],
    imgList: [], //图片展示
    htmlLoading: false,
    htmlSource: ref (''),
    messageQueue: [] as Array<{
      role: string; content: string; stop?: boolean; logs?: any;
      loading?: boolean;
    }>,
  }),
  //异步|逻辑的地方
  actions: {
    // 连接WebSocket服务器
    connect (url: string) {
      try {
        console.log (url, 'url')
        //获取ref值
        this.socket = new WebSocket (url);
        this.socket.onopen = () => {
          this.isConnected = true;
          if (url.indexOf ('agent/chat') > - 1) {
            this.isChatConnected = true;
            this.loading = true;
          } else if (url.indexOf ('agent/report') > - 1) {
            this.isReportConnected = true
            this.htmlLoading = true;
          }
          console.log ('WebSocket connected');
        };
        
        this.socket.onmessage = (event) => {
          console.log ('Message received:', JSON.parse (event.data));
          const data = JSON.parse (event.data)
          if (data.type == 'logs' || data.type == 'images') {
            if (data.output) {
              // @ts-ignore
              this.answer.logs.push (data)
            }
          }
          if (data.type == 'ref_internet') {
            this.sourceNumber += data.content ? data.content.length : 0;
            this.urlList = data.content
          }
          if (data.type == 'ref_space') {
            this.sourceNumber += data.content ? data.content.length : 0;
            this.spaceList = data.content
          }
          if (data.type == 'ref_images') {
            this.sourceNumber += data.content ? data.content.length : 0;
            this.imgList = data.content
          }
          if (data.type == 'report') {
            this.loading = false;
            this.answer.content += data.output
          }
          if (data.type == 'stop') {
            this.isFinish = true
          }
          if (data.type == 'report_completed') {
            this.htmlSource = data.content;
            this.htmlLoading = false;
          }
        };
        
        this.socket.onerror = (error) => {
          this.setSocketError ()
          console.error ('WebSocket error:', error);
        };
        
        this.socket.onclose = () => {
          this.setSocketError ()
          console.log ('WebSocket disconnected');
        };
      } catch (e) {
        console.log (e)
        // print (e)
      }
    },
    //网络不好时，提示 服务器异常，请稍后再试
    setSocketError () {
      //连接断开
      this.isConnected = false;
      // setTimeout(()=>{
      //对话没有成功返回内容时
      if (this.answer.content.trim () == '' && this.socket.url.indexOf ('agent/chat') > - 1) {
        this.answer.content = "申し訳ございません。現在アクセスが集中しておりますので、数分後再度お試しください。"// t('sysError')
        this.isChatConnected = false;
        this.isFinish = false;
        this.loading = false;
      }
      //报告没有成功返回内容时
      if (this.htmlSource == '' && this.socket.url.indexOf ('agent/report') > - 1) {
        this.isReportConnected = false;
      }
      // },500)
    },
    async creatHtmlLink () {
      const socket = `${import.meta.env.VITE_NODE_WS + '/agent/report'}`
      this.connect (socket);
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
        this.setSocketError ()
      }
    },
    
    //关闭
    close () {
      if (this.socket) {
        this.socket.close ();
        this.socket = null;
      }
    },
    resetConnection () {
      this.isConnected = false;
      this.isChatConnected = false;
      this.isReportConnected = false;
      this.isFinish = false;
      this.htmlSource = '';
      this.urlList = [];
      this.type2 = [];
      this.spaceList = [];
      this.imgList = [];
      this.sourceNumber = 0;
      this.answer={
        content: "",
        logs: [],
      }
    }
    
  },
  
  getters: {
    doubleMessages: (state) => state.messageQueue,
  }
})

