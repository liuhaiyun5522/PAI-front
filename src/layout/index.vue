<template>
  <div class="common-layout">
    <el-container>
<!--      todo 侧边栏   -->
      <Aside></Aside>
      <el-container style="flex-direction: column;position: relative;">
        <HeaderTemp v-if="$route.name!='workspaceDetail'"></HeaderTemp>
        <el-main>
          <div class="main-right-border" style="">
            <router-view :key="$route.fullPath+useMenu.pageKey"></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div class="progress-notification">
      <transition name="slide-right">
        <div class="el-notification right progress-notification-content" v-if="useWorkspace.progressShow"   >
          <div class="el-notification__group">
            <span class="el-notification__title progress-notification-name">{{useWorkspace.uploadSpaceInfo.name}}</span>
            <el-progress :percentage="useWorkspace.progress" color="#80BBAD" />
            <span class="progress-notification-status">{{useWorkspace.progress==100?'上传完成' : '上传中...'}}</span>
            <IconCloseFill class="progress-notification-close" @click="useWorkspace.progressShow=false"></IconCloseFill>
          </div>
        </div>
      </transition>
    </div>


  </div>
</template>


<script setup lang="ts">
import Aside from './aside.vue'
import HeaderTemp from './header.vue'
import {useRouter,useRoute} from "vue-router";
import useStore from "@/store";
const { useMenu,useWorkspace } = useStore()
const $route = useRoute()
import IconCloseFill from '@/assets/workspace/icon-close-fill.svg'
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
  padding-top: 10vh;
}
</style>
