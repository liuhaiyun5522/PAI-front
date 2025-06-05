<template>
  <div>
    <router-view></router-view>
  </div>
  <!-- <login/> -->
</template>
<script setup>

import {useRoute, useRouter} from "vue-router";

import useStore from '@/store'
const {useMenu} = useStore ()
const $route = useRoute ()
const $router = useRouter ()

</script>
<style>

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #F1F4F7;
}

</style>
