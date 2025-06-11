import {defineStore} from 'pinia'
import {ref} from 'vue';
//接口
// import {fileUpload} from '@/api/chat'
// 引入数据类型
import {get_file} from '@/api/chat/type'
export const useWebSocketStore = defineStore ('webSocket', {
  state: () => ({
    socket: null as WebSocket | null,
    //websocket是否连接中
    isConnected: ref (false),
    /*
    【role】对话角色 user：用户 ; any: AI
    【content】 对话内容
    【stop】 答案回答是否停止
    【showFlag】 出典内容是否展示
    【source】 出典具体内容
    【time】 时间
    【knowledge_name】 回答所属的知识库
    【thumbsUp】 点赞状态
    【loading】 是否展示loading
    【knowledge_list】 重新回答时所选的知识库
    【loadingIndex】 AI思考时所进行的步骤
    【showChoose】 是否展示重选
    【chooseDisabled】重选按钮是否禁用
    【knowledge_name_list】问题匹配到的知识库
    */
    // messageQueue: [] as Array<{ role: string; content: string; stop?: boolean; showFlag?: boolean;
    //   source?: string; time?: any; knowledge_name?: any; thumbsUp?: string; loading?: boolean;
    //   knowledge_list?:any;loadingIndex?:number;showChoose?:boolean;chooseDisabled?:boolean;
    //   knowledge_name_list?:any}>,
      messageQueue: [] as Array<{ role: string; content: string; source?: string; time?: any; }>,
    //对话是否结束
    isFinish: ref (true),
    //输入框发送内容
    inputMessage: '',
    //文件对话按钮默认不可点击
    disabled: ref (false),
    //loading循环定时器
    loadingTimer: null as any,
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
          console.log ('WebSocket connected');
        };
        
        this.socket.onmessage = (event) => {
          console.log ('Message received:', JSON.parse (event.data));
          this.messageQueue.forEach ((value, index) => {
            if (index === this.messageQueue.length - 1) {
              const data = JSON.parse (event.data)
              //问题匹配到的知识库
              if(data.knowledge_name_list){
                value.loadingIndex = 1
                value.knowledge_name_list = data.knowledge_name_list
                if (this.loadingTimer) clearInterval(this.loadingTimer);
                this.loadingTimer = setInterval(()=>{
                  // @ts-ignore
                  value.loadingIndex++;
                  // @ts-ignore
                  if(value.loadingIndex > 4){
                    value.loadingIndex = 2
                  }
                },4000)
              }
              //展示答案所属于的知识库名称
              if(data.knowledge_name){
                value.knowledge_name = data.knowledge_name
              }
              //思考时进行的步骤
              if(data.loadingIndex){
                value.loadingIndex = data.loadingIndex
                if (this.loadingTimer) clearInterval(this.loadingTimer);
                this.loadingTimer = setInterval(()=>{
                  // @ts-ignore
                  value.loadingIndex++;
                  // @ts-ignore
                  if(value.loadingIndex > 4){
                    value.loadingIndex = 2
                  }
                },4000)
              }
              if (data.answer) { //AI回答
                // value.time = this.formatDate(new Date().getTime())
                value.content += data.answer;
                value.showFlag = false
                value.stop = false
                value.loading = false
                
              } else if (data.ref) { //出典
                const str = data.ref
                const jsonStr = str.replace (/'/g, '"');
                const arr = JSON.parse (jsonStr);
                value.source = ''
                arr.forEach ((item: any, index: number) => {
                  value.source += `${index + 1}、 ${item.update_time ? item.update_time + ' の ' : ''}
<a href="${item.file_url || 'javascript:;'}" target="${item.file_url ? '_blank' : ''}">「${item.file_name}」</a>
${item.page_label ? ' の ' + item.page_label + 'ページ目' : ''}<br>`
                })
              } else if (data.type == 'stop') {
                if(this.loadingTimer){
                  clearInterval(this.loadingTimer)
                  this.loadingTimer = null
                }
               
                //AI本段停止后才能赋值和查看来源
                value.showChoose=true;
                value.stop = true
                //AI停止对话后发送按钮才能点击
                this.isFinish = true;
                this.close()
              }
              // else if (data.type == 'next') { //todo 多个库回答情况,一个库回答暂时完成，还有知识库库未完成回答
              //   value.content += `<el-divider />`
              // }
              else if (data.type == 'next') { //多个库回答情况
                //AI本段停止后才能赋值和查看来源
                value.stop = true
                //本段停止之后增加AI回答位置
                const messgesAny = {
                  role: "mul",//多个回答 角色为多个
                  content: '',
                  // knowledge_name: filterObj (knowledgeList.value, 'id', knowledgeBase.value).name,
                  time:this.formatDate(new Date().getTime()),
                  loading:true, //loading是否展示,
                  loadingIndex:0,
                  showChoose:false
                }
                this.messageQueue.push (messgesAny);
              }
            }
          })
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
        console.log(e)
        // print (e)
      }
    },
    //网络不好时，提示 服务器异常，请稍后再试
    setSocketError () {
      setTimeout(()=>{
        const index = this.findLastAnyIndex(this.messageQueue)
        console.log (index);
        if(this.messageQueue[index]&&!this.messageQueue[index].content){
          this.messageQueue[index].loading = false
          this.messageQueue[index].stop = false
          this.messageQueue[index].content ="申し訳ございません。現在アクセスが集中しておりますので、数分後再度お試しください。"// t('sysError')
        }
        this.isConnected = false;
        this.isFinish = true;
      },500)
    },
    
    findLastAnyIndex (arr:any) {
      for (let i = arr.length - 1; i >= 0; i --) {
        if (arr[i].role === 'any') {
          return i;
        }
      }
      return - 1;
    },
    
    formatDate (time?: any) {
      const date = new Date (time);
      const year = date.getFullYear ();
      const month = ("0" + (date.getMonth () + 1)).slice (- 2);
      const day = ("0" + date.getDate ()).slice (- 2);
      const hours = ("0" + date.getHours ()).slice (- 2);
      const minutes = ("0" + date.getMinutes ()).slice (- 2);
      const seconds = ("0" + date.getSeconds ()).slice (- 2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    
    //文件对话文件上传
    async FileUpload (data: get_file) {
      await fileUpload (JSON.parse (JSON.stringify (data)));
      this.disabled = false
    },
    
  },
  
  getters: {
    doubleMessages: (state) => state.messageQueue,
  }
  
})

