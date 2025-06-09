<template>
  <div class="chat-container box-div" id="chat-container">
    <div class="chat-message-list" ref="messageChat">
      <template v-for="(items, index) in webSocket.doubleMessages" class="chat-message">
        <!--    用户提问    -->
        <div v-if="items.role == 'user' && items.content != ''" class="edit-item edit-item-1">
          <div class="edit-item-content">
            <div class="edit-item-time">{{ items.time }}</div>
            <div class='markdown-font-span' style="line-height: 1.5;" v-html="newline(items.content)"></div>
          </div>
        </div>
        <!--    AI 回答    -->
        <div v-else-if="items.role == 'any' || items.role == 'mul'" class="edit-item edit-item-2">
          <div :class="[{ 'hidden': items.role == 'mul' }]"><img class="edit-item-img" :src="iconAi"></div>
          <div class="edit-item-content">
            <div class="edit-item-time" v-if="items.role == 'any'">Chat Bot {{ items.time }}</div>
            <el-divider v-if="items.role == 'mul'" style="margin-top: 0; margin-bottom: 14px;" />
            <!--   AI思考时  loading展示       -->
            <div v-if="items.loading" class="edit-item-loading-container">
              <TransitionGroup name="slide" tag="div" class="edit-item-loading-content">
                <div class="edit-item-loading" :key="0" v-show="items.loadingIndex == 0">
                  <img :src="iconSearch" alt="">{{ t('dialog.answerLoading0') }}
                </div>
                <div class="edit-item-loading" :key="1" v-show="items.loadingIndex == 1">
                  <img :src="iconSearch" alt="">{{
                    t('dialog.answerLoading1', { knowledgeList: (items.knowledge_name_list ? items.knowledge_name_list.join('、'):'')})
                  }}
                </div>
                <div class="edit-item-loading" v-for="n in [2, 3, 4]" :key="n" v-show="items.loadingIndex == n">
                  <img :src="iconSearch" alt="">{{ t('dialog.answerLoading' + n) }}
                </div>
              </TransitionGroup>
            </div>
            <!--    AI回答内容        -->
            <template v-else>
              <div v-if="items.knowledge_name" class="edit-item-analysis">
                <img :src="iconAnalysis" alt="">{{ t('analysis', { name: items.knowledge_name }) }}
              </div>
              <div class='markdown-font-span' style="line-height: 1.5; " v-html="removeFirstAndLastPTags(items.content)"
                @change="scrollToBottom"></div>
              <!--     AI全部回答完之后，展示出典，点赞，免责声明         -->
              <template v-if="items.stop">
                <div class="edit-item-icon">
                  <img :src="iconMenuFill" v-show="items.showFlag" @click="getSource(index)" alt="">
                  <img :src="iconMenu" v-show="!items.showFlag" @click="getSource(index)" alt="">
                  <img :src="iconCopy" @click="copyText(items.content)" alt="">
                  <!--      点赞功能 【thumbsUp】 ok:点赞 ; ng:点踩;       -->
                  <img :src="iconUpFill" v-show="items.thumbsUp == 'ok'" alt="">
                  <img :src="iconUp" v-show="items.thumbsUp != 'ok'" @click="clickThumbsUp('ok', index)" alt="">
                  <img :src="iconDownFill" v-show="items.thumbsUp == 'ng'">
                  <img :src="iconDown" v-show="items.thumbsUp != 'ng'" @click="clickThumbsUp('ng', index)">
                </div>
                <template v-if="items.showFlag">
                  <div v-if="items.source" class="edit-item-source-content">
                    <span>{{ $t('source') }}</span>
                    <div class="edit-item-source" v-html="items.source"></div>
                  </div>
                  <div class="edit-item-source-content" v-else>{{ t('noSource') }}</div>
                </template>
                <!--     重新选择知识库        v-if="items.showChoose!=false"  -->
                <div class="edit-item-choose edit-again">
                  <!--                  <div class="edit-again">-->

                  <div v-if="items.knowledge_name_list && items.knowledge_name_list.length > 1">
                    <!--                    <span :class="[{'active':items.knowledge_list?.indexOf(kItem.name)>-1},'edit-again-span']"-->
                    <!--                          v-for="kItem in knowledgeList"-->
                    <!--                          @click="checkBase(kItem.name,index)">{{t('dialog.knowledge',{name: kItem.name}) }}</span>-->
                    <!--                    </div>-->
                    <span class="edit-again-span"
                      v-for="kItem in items.knowledge_name_list.filter(item => item != items.knowledge_name)"
                      @click="handleOtherBase(kItem, index)">
                      <IconQuestion class="edit-again-icon"></IconQuestion>
                      {{ t('dialog.knowledgeContent', { name: kItem }) }}
                      <el-icon style="margin-left: 6px">
                        <Right />
                      </el-icon>
                    </span>
                  </div>
                  <!--                  </div>-->
                  <!--       重新发送           -->
                  <!--                  <div style="text-align: right;">-->
                  <!--                    <el-button type="success" size="mini" :disabled="!(items.knowledge_list&&items.knowledge_list.length>0)||items.chooseDisabled||!webSocket.isFinish" class="edit-again-btn" @click="resend(index)">-->
                  <!--                      <IconAgain></IconAgain>-->
                  <!--                      {{ t ('again') }}-->
                  <!--                    </el-button>-->
                  <!--                  </div>-->
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="chat-input">
      <el-input v-model="webSocket.inputMessage" :placeholder="t('enterQuestion')" type="textarea"
        class="autoresize-textarea" :autosize="{ minRows: 2, maxRows: 5 }" @keydown.ctrl.enter="handleKeydown" v-focus>
      </el-input>
      <div class="chat-input-bottom">
        <div class="chat-input-button">
          <!--        todo 上传             -->
          <!--          <el-tooltip class="item" effect="light" :content="t('fileSuggest')" placement="top">-->
          <!--            <div class="file-icon" @click="triggerFileUpload">-->
          <!--              <img class="chat-img" :src="iconFile" alt="">-->
          <!--              <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;"-->
          <!--                     accept=".doc,.docx,.txt,.xls,.xlsx,.pdf" :max-file-size="104857600">-->
          <!--            </div>-->
          <!--          </el-tooltip>-->
          <el-tooltip class="item" effect="light" content="送信（Ctrl+Enter）" placement="top">
            <el-button :icon="IconSend" :disabled="!webSocket.isFinish" type="primary" @click="firstSend">
              {{ t('send') }}
            </el-button>
          </el-tooltip>

        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang='ts'>
import { nextTick, onUnmounted, onMounted, ref, watch, watchEffect } from 'vue';
import useWebSocketStore from '@/store';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import { changeFilechat } from '@/utils/minio.js';
import { getHistoryMessage, handleThumbsUp, historySaveList, getKnowledgeList } from "@/api/chat";
import { verifyToken } from "@/api/index";
import iconAi from '@/assets/icon-ai.png'
import IconSend from '@/assets/icon-send.svg'
import iconCopy from '@/assets/icon-copy.png'
import iconMenu from '@/assets/icon-menu.png'
import iconMenuFill from '@/assets/icon-menu-fill.png'
import iconFile from '@/assets/icon-file.png'
import iconUp from '@/assets/icon-up.png'
import iconUpFill from '@/assets/icon-up-fill.png'
import IconUpFill from '@/assets/icon-up-fill.svg'
import iconDown from '@/assets/icon-down.png'
import iconDownFill from '@/assets/icon-down-fill.png'
import IconDownFill from '@/assets/icon-down-fill.svg'
import IconAgain from '@/assets/icon-again.svg'
import IconQuestion from '@/assets/icon-question.svg'
import iconAnalysis from '@/assets/icon-analysis.png'
import iconSearch from '@/assets/icon-search.gif'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
import { newline, filterObj, formatObj } from '@/utils'
//引入markdown
import MarkdownIt from 'markdown-it';
import mdKatex from '@traptitech/markdown-it-katex'
import markdownItForInline from "markdown-it-for-inline";
import hljs from 'highlight.js' //代码块高亮
import 'highlight.js/styles/github.css' // 代码块高亮样式
import 'github-markdown-css'

const { webSocket } = useWebSocketStore();
//知识库列表
const knowledgeList = ref([] as Array<{ name: string; id: string }>)
//当前知识库
const knowledgeBase = ref()

async function getKnowledgeListFun() {
  const res = await getKnowledgeList()
  knowledgeList.value = res.data.message
  // knowledgeBase.value = knowledgeList.value[0].id
}

// getKnowledgeListFun ()

//对话id
const chatId = ref()
const oldMsgLength = ref(0)
const $route = useRoute();

onMounted(async () => {
  webSocket.inputMessage = '';
  webSocket.messageQueue = [];
  webSocket.isFinish = true;
  chatId.value = $route.query.id
  if ($route.query.id) {
    // 调用历史记录接口
    const res = await getHistoryMessage({ id: chatId.value })
    if (res.data.status_code == '200') {
      oldMsgLength.value = JSON.parse(res.data.message)?.length
      webSocket.messageQueue = JSON.parse(res.data.message);
      await nextTick(() => {
        scrollToBottom();
      });
    }
  }
})
import useMenuStore from "@/store";

const { useMenu } = useMenuStore();

//监听对话完成，调用存储接口
watch(() => webSocket.isFinish, (newVal) => {
  if (newVal == true) {
    // console.log ('调用存储历史接口')
    saveHistory(true)
  }
})
import { v4 as uuidv4 } from 'uuid';

//存储历史
async function saveHistory(isCall: boolean) {
  if (webSocket.doubleMessages.length > 0) {
    if (!chatId.value) {
      chatId.value = uuidv4()
    }
    const params = {
      user_id: '',
      history_json: JSON.stringify(webSocket.doubleMessages),
      id: chatId.value || ''
    }
    console.log(params)
    const res = await historySaveList(params)
    if (res.data.status_code == '200') {
      //存储后，调用获取历史列表
      if (isCall) {
        useMenu.getMenuList()
      }
    }
  }
}

//获取来源
function getSource(index: number) {
  //点击 【出处】 隐藏/展示
  webSocket.messageQueue[index].showFlag = !webSocket.messageQueue[index].showFlag
}

//点击复制
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage({
      message: t("copyTip1"),
      type: 'success',
    })
  } catch (err) {
    ElMessage({
      message: t("copyTip2"),
      type: 'error',
    })
  }
};

// const md = new MarkdownIt();
const md = new MarkdownIt({
  html: true, // 允许HTML标签
  linkify: true,
  // typographer: true, // 启用某些typographer规则

  highlight(code: string, language: string) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(lang, code, true).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  }
}).use(mdKatex, {
  blockClass: 'katexmath-block rounded-md p-[10px]',
  errorColor: ' #cc0000'
}).use(markdownItForInline, "url_new_win", "link_open", (tokens: any, idx: any) => {
  // 自定义链接属性
  tokens[idx].attrSet("target", "_blank");
  tokens[idx].attrSet("rel", "noopener noreferrer");
})

function highlightBlock(str: string, lang: string) {
  lang = lang || "text";
  return `<pre class="pre-code-box">
              <div class="pre-code-header"
              style = "
                  background-color: #50505a;
                  padding: 0.2rem;
                  padding-left: 1rem;
                  color: white;
                  font-size: 1rem;
                  border-top-left-radius: 10px;
                  border-top-right-radius: 10px;
              "><span class="code-block-header__lang">${lang}</span></div><div class="pre-code"><code class="hljs code-block-body ${lang}" style="padding:1.5rem; font-size: 1.05rem;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;" >${str}</code></div></pre>`
}

const fileInput = ref<HTMLInputElement | null>(null);

const ENV_WEBSOCKET_URL = import.meta.env.VITE_NODE_ENV8009

//上传文件点击
function triggerFileUpload() {
  if (webSocket.isFinish && fileInput.value) {
    fileInput.value.click();
  }
};

//唯一编码
function generateUniqueName() {
  // 生成一个基于时间戳和随机数的唯一编码
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}${randomNum}`;
}

//发送消息重新赋值
const sendMsg = ref('')
const historyList = ref()

//发送按钮
async function sendMessageButton(socket) {
  console.log(webSocket.isFinish)
  //如果对话id是空，则新建一个对话id
  if (webSocket.isFinish) {
    if (sendMsg.value) {
      webSocket.inputMessage = ''
      // //token 校验，通过 链接socket，发送对话
      // const res = await verifyToken ()
      // console.log (res.data)
      // if (res.data.status_code == '200') {

      webSocket.connect(socket);
      webSocket.isFinish = false;
      //构建历史记录 再添加新消息之前构建
      const doubleMessage = webSocket.doubleMessages;
      const history: { role: string; content: string; stop?: boolean | undefined; showFlag?: boolean | undefined; source?: string | undefined; time?: any; }[] = [];
      // 判断 doubleMessage 长度，取最后6条或全部
      const messagesToUse = doubleMessage.filter(msg => ['user', 'any'].includes(msg.role)) //新增过滤条件，只保留user/any角色
        .slice(-6); //  直接取最后6条（无需判断长度，slice(-n)会自动处理）

      messagesToUse.forEach(msg => {
        if (msg.role) {
          if (msg.role === 'any') {
            history.push({ "role": "assistant", "content": msg.content });
          } else {
            history.push(msg);
          }
        }
      });
      historyList.value = history;
      //构建新消息 用户方
      const messgesUser = {
        role: "user",
        content: sendMsg.value,
        time: webSocket.formatDate(new Date().getTime())
      }
      //AI消息框架  AI消息再0.5s之后再添加
      const messgesAny = {
        role: "any",
        content: '',
        showChoose: !(selectKnowledge.value && selectKnowledge.value.length > 0),
        time: webSocket.formatDate(new Date().getTime()),
        loading: true, //loading是否展示
        loadingIndex: 0,
        chooseDisabled: false
      }
      webSocket.messageQueue.push(messgesUser);
      setTimeout(() => {
        webSocket.messageQueue.push(messgesAny);
      }, 500)
    }
  } else {
    ElMessage({
      message: t("required"),
      type: 'warning',
    })
  }
  // }
};
const selectKnowledge = ref()
//重新发送按钮
function resend(index: number, name: string) {
  if (webSocket.messageQueue[index].chooseDisabled) {
    return false;
  }
  const selectList = [name];//webSocket.messageQueue[index].knowledge_list
  if (selectList && selectList.length > 0) {
    const question = webSocket.doubleMessages[findLastUserIndex(index)];
    //问题
    sendMsg.value = question.content
    //所选知识库
    selectKnowledge.value = selectList
    const socket = `${import.meta.env.VITE_NODE_WS + '/knowledge/qa_again/' + uuidv4()}`
    sendMessageButton(socket)
    webSocket.messageQueue[index].chooseDisabled = true;
  } else {
    ElMessage({
      message: '请选择知识库',
      type: 'warning',
    })
  }

}
//点击发送按钮
function firstSend() {
  //发送消息重新赋值，再清空
  console.log("222")
  sendMsg.value = formatObj(webSocket.inputMessage).trim()
  selectKnowledge.value = null
  const socket = `${import.meta.env.VITE_NODE_WS + '/common_chat/111'}`
  sendMessageButton(socket)
}
watch(() => webSocket.isConnected, (newVal) => {
  if (newVal == true) {
    setTimeout(() => {
      handleDialogWebsocket(historyList.value)
    }, 500)
  }
})

//发送消息的构建
function handleDialogWebsocket(history: any) {

  const message = {
    question: sendMsg.value,
    history,
    knowledge_list: selectKnowledge.value,
    // knowledge_id: knowledgeBase.value, //选定的知识库
    // knowledge_name: filterObj (knowledgeList.value, 'id', knowledgeBase.value).name  //选定的知识库
  }
  console.log(webSocket.messageQueue)
  webSocket.sendMessage(message)
}

//文件上传
function handleFileChange(event: Event) {

  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.size > 104857600) { // 100MB in bytes
      alert(t('fileSuggest'));
      return;
    }
    const originalFile = target.files[0];
    const uniqueName = generateUniqueName();
    // 创建一个新的 File 对象，使用唯一编码作为文件名
    const newFile = new File([originalFile], uniqueName + originalFile.name.slice(originalFile.name.lastIndexOf('.')), {
      type: originalFile.type
    });

    const index = webSocket.doubleMessages.length;
    const fileName = ref({ content: originalFile.name, role: 'user', fileFlag: '2', index: index })
    webSocket.doubleMessages.push(fileName.value);
    console.log(webSocket.doubleMessages);

    webSocket.socket = import.meta.env.VITE_NODE_WS + '/file_chat/upload'
    webSocket.connect(webSocket.socket)
    //emit ('file-uploaded', originalFile.name); // 触发事件，将文件名传递给父组件
    changeFilechat({ file: newFile }, null);

  }
};

//监听 消息队列
watch(() => webSocket.doubleMessages[webSocket.doubleMessages?.length - 1], () => {
  // 确保 DOM 更新后执行滚动
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

const messageChat = ref<HTMLElement | null>(null);

// 自动滚动到最底部
function scrollToBottom() {
  if (messageChat.value) {
    messageChat.value.scrollTop = messageChat.value.scrollHeight;
  }
};

// ctrl+enter: 发送消息
function handleKeydown(event: { preventDefault: () => void; }) {
  event.preventDefault(); // 防止默认的回车行为
  firstSend();
}

function removeFirstAndLastPTags(content: any) {
  let result = (content);
  result = result.replace(/- <strong>/g, '<br>$&');
  result = result.replace(/- *\*/g, '<br>$&');
  return md.render(result);
}

//点击点赞/踩
async function clickThumbsUp(type: string, index: number) {
  const question = webSocket.doubleMessages[findLastUserIndex(index)];
  const answer = webSocket.doubleMessages[index]
  const params = {
    Q: question.content,
    A: answer.content,
    type: type,
    knowledge_name: answer.knowledge_name
  }
  const res = await handleThumbsUp(params)
  if (res.data.status_code == '200') {
    //更改点赞状态
    webSocket.messageQueue[index].thumbsUp = type
    saveHistory(false)
  }
}
function findLastUserIndex(index: number) {
  const arr = webSocket.messageQueue;
  for (let i = index - 1; i >= 0; i--) {
    if (arr[i].role === 'user') {
      return i;
    }
  }
  return - 1;
}
//自定义指令，输入框自动获取焦点
const vFocus = {
  mounted: (el: any) => {
    el.querySelector(".el-textarea__inner").focus()
  }
}

//选择重写库 name：点击的知识库名称 ;index：对话索引
function checkBase(id: string, index: number) {
  if (webSocket.messageQueue[index].chooseDisabled) {
    return false;
  }
  const obj = webSocket.messageQueue[index]
  if (!obj.knowledge_list) {
    obj.knowledge_list = []
  }
  const kIndex = obj.knowledge_list.indexOf(id);
  if (kIndex !== - 1) {
    // 存在则删除第一个匹配项
    obj.knowledge_list.splice(kIndex, 1)
  } else {
    // 不存在则新增
    obj.knowledge_list.push(id)
  }
}
//点击其他知识库，再次提问
function handleOtherBase(name: string, index: number) {
  const obj = webSocket.messageQueue[index]
  if (!obj.knowledge_name_list) {
    obj.knowledge_name_list = []
  }
  //点击知识库之后，移除该知识库
  const kIndex = obj.knowledge_name_list.indexOf(name);
  // 存在则删除第一个匹配项
  webSocket.messageQueue[index].knowledge_name_list.splice(kIndex, 1)
  resend(index, name)
}

</script>

<style lang='scss' scoped>
@import './../../style/components/chat.scss';
/* 你可以添加highlight.js的样式 */
@import 'highlight.js/styles/github.css';
</style>
