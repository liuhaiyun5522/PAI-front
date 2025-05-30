<template>
  <div>
    <router-view></router-view>
  </div>
  <!-- <login/> -->
</template>
<script setup>

import {useRoute, useRouter} from "vue-router";
import {verifyToken} from '@/api/index'

import useStore from '@/store'
const {useMenu} = useStore ()
const $route = useRoute ()
const $router = useRouter ()
$router.isReady ().then (async () => {
  // if ($route.query.id_token) {
  //   localStorage.setItem ("token", $route.query.id_token)
  // }
  //  const token = localStorage.getItem ("token")
  //   if (token) {
  //     //调用检查token接口
  //     await verifyToken ()
  //     useMenu.getUserInfo()
  //   } else {
  //     window.location.href = import.meta.env.VITE_LOGIN_URL
  //   }
});


</script>
<style>

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #F1F4F7;
}

</style>
