<template>
  <div class="agent-chat container" v-loading="pageLoading">
    <div class="agent-chat-container">
      <div class="agent-chat-title"
           v-html="newline(chatInfo.agent_name)">
      </div>
      <div class="agent-chat-type" v-if="chatInfo.agent_source_list">
        <span class="agent-chat-type-text" v-if="chatInfo.llm_name">{{filterObj(aiVersion,'value',chatInfo.llm_name).label}}</span>
        <span class="agent-chat-type-text" v-for="(item,index) in chatInfo.sourceList">
          <template v-if="item.source_type == '1'">
            <template v-if="item.content[0]=='all'">
              {{ t ('agentObj.allSearch') }}
            </template>
            <template v-else>
              {{ t ('agentObj.urlSearch') }}
            </template>
          </template>
          <template v-else-if="item.source_type == '3'">{{ item.content.length }}つのWorkSpace</template>
        </span>
      </div>

      <div class="agent-chat-list" ref="messageChat">
        <!--    AI 回答    -->
        <div class="agent-chat-content">
          <!--   AI思考时  loading展示       -->
          <!--    链接后展示loading      -->
          <div class="agent-chat-search" v-if="useAgent.isChatConnected">
            <el-collapse accordion>
              <el-collapse-item name="searchStep">
                <template #title>
                  <div class="agent-chat-search-item">
                    <!--        检索时 展示检索中              -->
                    <template v-if="useAgent.loading">
                      <span class="agent-chat-search-text">{{ t ('agentObj.searching') }}</span>
                      <template v-if="useAgent.answer.logs.length>0">
                        <template v-if="useAgent.answer.logs[useAgent.answer.logs.length-1].type=='images'">
                          🖼️ {{ t ('imageSearch') }}
                        </template>
                        <template v-else>{{ useAgent.answer.logs[useAgent.answer.logs.length - 1].output }}</template>
                      </template>
                    </template>
                    <!--        展示检索完成             -->
                    <template v-else>
                      <IconSearchFinish style="vertical-align: -4px;margin-right: 6px;"></IconSearchFinish>
                      <span class="agent-chat-search-text">{{ t ('agentObj.searchFinish') }}</span>
                    </template>
                  </div>
                </template>
                <div class="agent-chat-search-content" ref="searchContentRef">
                  <!--        检索步骤          -->
                  <div class="agent-chat-search-item" v-for="(item,index) in useAgent.answer.logs">
                    <span class="agent-chat-search-text"
                          :style="index != 0?'visibility: hidden;':''">{{ t ('agentObj.searchStep') }}</span>
                    <template v-if="item.type=='images'">
                      🖼️ {{ t ('agentObj.imageSearch') }}
                    </template>
                    <template v-else>{{ item.output }}</template>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <!--    AI回答内容        -->
          <div v-if="useAgent.answer.content.length>0" class='markdown-font-span' style="line-height: 1.5; "
               v-html="removeFirstAndLastPTags(useAgent.answer.content)"></div>
          <el-skeleton style="margin-top: 10px;" v-else :rows="8" animated/>
        </div>
      </div>
      <!--   检索完成时展示   -->
      <div class="agent-chat-bottom" v-if="!useAgent.loading&&useAgent.isChatConnected">
        <span>
          <IconSummarize style="vertical-align: -5px;"></IconSummarize>
           {{
            t ('agentObj.searchSummarize', {
              sourceNum: useAgent.sourceNumber,
              contentNum: useAgent.answer.content.length,
              status: useAgent.isFinish ? t ('agentObj.finish') : t ('agentObj.notFinish')
            })
          }}
        </span>
       <!--    模型 claude-3-7 才有导出报告按钮   -->
        <div v-if="useAgent.isFinish && chatInfo.llm_name == 'anthropic:claude-3-7-sonnet-20250219'">
          <!--  html连接为空时，第一次获取报告   -->
          <!--  连接为空，且连接状态为空 为第一次获取  -->
          <el-button v-if="useAgent.htmlSource == ''&&!useAgent.isReportConnected"  type="primary" :icon="IconExportHtml" @click="setHtmlContent">{{ t ('agentObj.getHtml') }}
          </el-button>
          <!--    生成过报告   重新生成   -->
          <template v-else>
            <!--     报告生成完成后，可重新生成      -->
            <el-button v-if="!useAgent.htmlLoading" type="primary" :icon="IconExportHtml" @click="reloadHtmlContent">{{ t ('agentObj.getHtml') }}
            </el-button>

          </template>
          <!--    查看报告     -->
          <el-button v-if="useAgent.isReportConnected" type="success" :icon="IconExportHtml" @click="goHtml"
                     :loading="useAgent.htmlLoading">{{ t ('agentObj.viewHtml') }}
          </el-button>
        </div>

      </div>
    </div>
    <!--  检索源  -->
    <!--  socket链接后展示检索源  -->
    <div class="agent-chat-source" v-if="useAgent.isChatConnected">
      <el-collapse :model-value="['1','2','3','4']">
        <el-collapse-item class="agent-chat-source-box" v-for="sItem in chatInfo.sourceList" :name="sItem.source_type">
          <template #title="{ isActive }">
            <div class="agent-chat-source-title">
              <IconLink v-if="sItem.source_type == '1'" style="margin-right: 10px;vertical-align: -5px;"></IconLink>
              <IconSpace v-else-if="sItem.source_type == '3'" style="margin-right: 10px;vertical-align: -5px;"></IconSpace>
              {{ sourceText[parseInt (sItem.source_type) - 1] }}
            </div>
          </template>
          <el-skeleton style="margin-top: 10px;" v-if="useAgent.loading" :rows="5" animated/>
          <tepmpate v-else>
            <Source v-if="sItem.source_type=='1'" :sourceList="useAgent.urlList.slice(0,2)"
                    :type="sItem.source_type" :allNumber="useAgent.urlList.length" @showAll="showAll($event)"></Source>
            <Source v-else-if="sItem.source_type=='3'" :sourceList="useAgent.spaceList.slice(0,2)"
                    :type="sItem.source_type" :allNumber="useAgent.spaceList.length" @showAll="showAll($event)"></Source>
          </tepmpate>

        </el-collapse-item>
        <el-collapse-item class="agent-chat-source-box" name="4">
          <template #title="{ isActive }">
            <div class="agent-chat-source-title">
              <IconImg style=" margin-right: 10px;vertical-align: -5px;"></IconImg>
              {{ t ('agentObj.image') }}
            </div>
          </template>
          <el-skeleton style="margin-top: 10px;" v-if="useAgent.loading" :rows="5" animated/>
          <tepmpate v-else>
            <Source :sourceList="useAgent.imgList.slice(0,6)"
                    type="4" :allNumber="useAgent.imgList.length" @showAll="showAll($event)"></Source>
          </tepmpate>

        </el-collapse-item>
      </el-collapse>

    </div>
    <!--  检索源查看全部  -->
    <el-drawer
        v-model="visible"
        :title="sourceText[parseInt(showType)-1] "
        direction="rtl"
        size="50%"
        class="agent-chat-drawer"
    >
      <div class="agent-chat-source-box">

        <Source v-if="showType=='1'" :sourceList="useAgent.urlList"
                :type="showType" :showAllIcon="false" ></Source>
        <Source v-else-if="showType=='3'" :sourceList="useAgent.spaceList"
                :type="showType" :showAllIcon="false"></Source>
        <Source v-else-if="showType=='4'" :sourceList="useAgent.imgList"
                :type="showType" :showAllIcon="false"></Source>
      </div>
    </el-drawer>
    <!--  html 报告编辑弹窗  -->
    <el-drawer
        v-model="htmlVisible"
        :title="t('agentObj.getHtml') "
        direction="rtl"
        size="80%"
        class="html-drawer drawer-style"
    >
      <el-row class="html-drawer-container" :gutter="20">
        <el-col :span="15">
          <div class="dialog-agent-title">
            {{ t('agentObj.contentEdit') }}
          </div>
          <div>
            <el-input class="html-drawer-input" type="textarea" v-model="htmlOptions.agent_answer"></el-input>
          </div>
        </el-col>
        <el-col :span="9" >
          <div style="height: calc(100vh - 194px);overflow-y: auto;">
            <div class="dialog-agent-title">
              {{ t('agentObj.style') }}
            </div>
            <!--    颜色      -->
            <div class="dialog-agent-box dialog-agent-bg">
              <div class="html-drawer-subtitle">{{ t('agentObj.color') }}</div>
              <div class="html-drawer-box html-drawer-color">
                <div :class="['html-drawer-color-item',{'active':htmlOptions.color==index}]"
                     v-for="(item,index) in colorList" @click="handleColor(index)">
                  <span class="html-drawer-color-span" v-for="cItem in item.list" :style="'background: '+cItem"></span>
                  <span class="html-drawer-color-text">{{item.name}}</span>
                </div>
              </div>
            </div>
            <!--    风格      -->
            <div class="dialog-agent-box dialog-agent-bg" >
              <div class="html-drawer-subtitle">  {{ t('agentObj.style') }}</div>
              <div class="html-drawer-box html-drawer-style">
              <span :class="['html-drawer-style-span',{'active':htmlOptions.style==index}]"
                    v-for="(item,index) in styleList" @click="handleStyle(index)">
                {{item}}
              </span>
              </div>
            </div>
          </div>

          <div class="dialog-agent-tips">
            {{t('agentObj.htmlTip')}}
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <div style="flex: auto">
          <el-button type="info" @click="htmlVisible=false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="handleHtmlConfirm">
            {{ t('agentObj.run') }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";

const $router = useRouter ()
const $route = useRoute ()
import {useI18n} from "vue-i18n";
const { t } = useI18n ()
import useStore from '@/store'

const { useAgent } = useStore ()
import {watch, nextTick, onMounted, ref, reactive} from 'vue'
import {ElLoading} from 'element-plus'
import IconSearchChat from '@/assets/agent/icon-searchChat.svg'
import IconSearchFinish from '@/assets/agent/icon-searhFinish.svg'
import IconExportHtml from '@/assets/agent/icon-export-html.svg'
import IconLink from '@/assets/agent/icon-link.svg'
import IconImg from '@/assets/agent/icon-img.svg'
import IconSpace from '@/assets/agent/icon-space.svg'
import IconSummarize from '@/assets/agent/icon-summarize.svg'
import {getAgentChatApi} from '@/api/agent/index'
import Source from './components/Source.vue'

const chatInfo = ref ({
  agent_name: '',
  agent_step_list: [],
  agent_chat: '',
  agent_source_list: [],
  sourceList: [],
  llm_name:''
})
const sourceText = [t ('agentObj.internet'), 'snowflake', 'WorkSpace',t('agentObj.image')]
const id = $route.query.id
const pageLoading = ref (false)
onMounted (async () => {
  if (id) {
    let loadingInstance = ElLoading.service ({
      target: document.querySelector (".agent-chat"),
      fullscreen: false
    });

    //根据对话id 获取对话检索详情
    const res = await getAgentChatApi ({ agent_chat_id: id })
    chatInfo.value = res.data.message
    //对话检索源格式整理，根据source_type进行分组
    chatInfo.value.sourceList = Object.values (
        chatInfo.value.agent_source_list.reduce ((acc: any, curr: any) => {
          const key = curr.source_type;
          if (!acc[key]) {
            acc[key] = { source_type: key, content: [] };  // 注意保持字段拼写与要求一致
          }
          acc[key].content.push (curr.source_content);
          return acc;
        }, {})
    );
    loadingInstance.close ()
    if (chatInfo.value.agent_name.trim () != ''&& !useAgent.isChatConnected) {
      const socket = `${import.meta.env.VITE_NODE_WS + '/agent/chat'}`
      useAgent.connect (socket);
    }
  }

})
watch (() => useAgent.isChatConnected, (newVal) => {
  if (newVal == true) {

    setTimeout (() => {

      let sendContent = `${chatInfo.value.agent_chat}の${chatInfo.value.agent_name} 以下の手順に従って実行し分析する\n`
      chatInfo.value.agent_step_list.forEach ((item: any,index:number) => {
        sendContent += (item + '\n')
      })
      sendContent += '上記の情報を収集した後、全ての情報を基づいて、オフィス移転の可能性を分析する\n' +
          'レポート出力時、各ステップで収集した情報をそのまま出力して、最後にオフィス移転の可能性分析の理由と結果を出力する。'
      const sendObj = {
        instance_id: id,
        question: sendContent,
      }
      useAgent.sendMessage (sendObj)

    }, 500)
  }
})

const messageChat = ref<HTMLElement | null> (null);
//监听 消息队列
watch (() => useAgent.answer.content, () => {
  // 确保 DOM 更新后执行滚动
  nextTick (() => {
    // 自动滚动到最底部
    if (messageChat.value) {
      messageChat.value.scrollTop = messageChat.value.scrollHeight;
    }
  });
}, { deep: true });

const searchContentRef = ref<HTMLElement | null> (null);
//监听 检索过程
watch (() => useAgent.answer.logs, () => {
  // 确保 DOM 更新后执行滚动
  nextTick (() => {
    // 自动滚动到最底部
    if (searchContentRef.value) {
      searchContentRef.value.scrollTop = searchContentRef.value.scrollHeight;
    }
  });
}, { deep: true });

/*检索源 start*/
const visible = ref (false)
const showType = ref ()

//检索源展示全部
function showAll (key: any) {
  visible.value = true
  showType.value = key
}
/*检索源 end*/

import {newline,filterObj,aiVersion} from '@/utils'
//引入markdown
import MarkdownIt from 'markdown-it';
import mdKatex from '@traptitech/markdown-it-katex'
import markdownItForInline from "markdown-it-for-inline";
import hljs from 'highlight.js' //代码块高亮
import 'highlight.js/styles/github.css' // 代码块高亮样式
import 'github-markdown-css'

const md = new MarkdownIt ({
  html: true, // 允许HTML标签
  linkify: true,
  // typographer: true, // 启用某些typographer规则

  highlight (code: string, language: string) {
    const validLang = !!(language && hljs.getLanguage (language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock (hljs.highlight (lang, code, true).value, lang)
    }
    return highlightBlock (hljs.highlightAuto (code).value, '')
  }
}).use (mdKatex, {
  blockClass: 'katexmath-block rounded-md p-[10px]',
  errorColor: ' #cc0000'
}).use (markdownItForInline, "url_new_win", "link_open", (tokens: any, idx: any) => {
  // 自定义链接属性
  tokens[idx].attrSet ("target", "_blank");
  tokens[idx].attrSet ("rel", "noopener noreferrer");
})

function highlightBlock (str: string, lang: string) {
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

function removeFirstAndLastPTags (content: any) {
  if (content.trim () != '') {
    let result = (content);
    result = result.replace (/- <strong>/g, '<br>$&');
    result = result.replace (/- *\*/g, '<br>$&');
    return md.render (result);
  }
}

/*报告生成*/
const htmlVisible = ref(false)
const htmlOptions= reactive({
  agent_answer:'',
  color:0,
  style:0,

})
//颜色列表
const colorList = [
  {
    name: 'CBRE',
    list:['#003F2D','#012A2D','#538184','#80BBAD','#778E9C','#DADFE0'],
  },
  {
    name: 'DaybreakBlue',
    list:['#1890FF','#40A9FF','#69C0FF','#91D5FF','#BAE7FF','#E6F7FF'],
  },
  {
    name: 'Gurden Purple',
    list:['#722ED1','#9254DE','#B37FEB','#D3ADF7','#EFDBFF','#F9F0FF'],
  },
  {
    name: 'Magenta',
    list:['#EB2F96','#F759AB','#FF85C0','#FFADD2','#FFD6E7','#FFF0F6'],
  },
  {
    name: 'Volcano',
    list:['#FA541C','#FF7A45','#FF9C6E','#FFBB96','#FFD8BF','#FFF2E8'],
  },
  {
    name: 'Sunrise Yellow',
    list:['#7C6E14','#AA9514','#FADB14','#FFFB8F','#FFFFB8','#FEFFE6'],
  },
  {
    name: 'Cyan',
    list:['#13A8A8','#36CFC9','#5CDBD3','#87E8DE','#B5F5EC','#E6FFFB'],
  }
]
//风格列表
const styleList = [t('agentObj.style1'),t('agentObj.style2'),t('agentObj.style3'),
  t('agentObj.style4'),t('agentObj.style5'),t('agentObj.style6'),t('agentObj.style7'),
  t('agentObj.style8'),t('agentObj.style9')]

//赋值html报告内容
function setHtmlContent () {
  htmlOptions.agent_answer = useAgent.answer.content;
  htmlVisible.value = true;
}
//重新生成html报告内容
function reloadHtmlContent(){
  htmlVisible.value = true;
}
//选择颜色设定
function handleColor (index: number) {
  htmlOptions.color = index
}
//选择风格设定
function handleStyle(index: number){
  htmlOptions.style = index
}
//确认html报告内容和风格
function handleHtmlConfirm () {
  htmlVisible.value = false
  useAgent.isReportConnected = false
  nextTick(()=>{
    useAgent.creatHtmlLink()
  })

}
//html修改文字，选择风格确认
watch (() => useAgent.isReportConnected, (newVal) => {
  if (newVal == true) {
    setTimeout (() => {
      const sendObj = {
        instance_id: id,
        agent_answer:htmlOptions.agent_answer,
        report_color:colorList[htmlOptions.color].list.join('、'),
        report_style:styleList[htmlOptions.style]
      }
      useAgent.sendMessage (sendObj)
    }, 500)
  }
})
//前往报告连接
function goHtml () {
  window.open (`${import.meta.env.VITE_FILE_SEVER_ENV}/${useAgent.htmlSource}`)
}
/*报告生成*/
</script>

<style scoped>
@import './../../style/components/agent.scss';
</style>
