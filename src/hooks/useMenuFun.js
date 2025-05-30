import {useRouter, useRoute} from 'vue-router';
import {useMenuStore} from "@/store/modules/useMenu";
import {ref, reactive, nextTick} from 'vue'
//前往对话
export function useGoPageHandler () {
  const $router = useRouter ()
  const $route = useRoute ()
  const useMenu = useMenuStore ()
  //点击侧边栏， 前往对话页
  function useGoDialog (id) {
    document.getElementById('aside')?.classList.remove('sm-show')
    document.querySelectorAll(".active.aside-icon")[0]?.classList.remove("active")
    //新对话时 增加pageKey 触发加载
    if (!$route.query.id) {
      useMenu.pageKey++
    }
    $router.push ({
      name: 'dialog',
      query:{
        id:id
      }
    })
  }
  //点击按钮 增加class
  function clickIcon ($event){
    document.querySelectorAll(".active.click-icon")[0]?.classList.remove("active")
    const targetIcon = $event.currentTarget;
    nextTick(() => {
      targetIcon.classList.add('active');
    });
  }
  return {useGoDialog,clickIcon}
}
