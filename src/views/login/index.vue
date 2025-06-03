<template>
    <div class="main">
        <div class="container">
            <!-- 左侧图片（绑定动态语言图片） -->
            <div class="left-panel">
                <img :src="loginImage" alt="Login Image" />
            </div>
            <!-- 右侧登录面板 -->
            <div class="right-panel">
                <!-- 语言切换 -->
                <div class="language-switch">
                    <el-select v-model="$i18n.locale" @change="changeLanguage">
                        <el-option v-for="lang in languages" :key="lang.value" :label="lang.label"
                            :value="lang.value" />
                    </el-select>
                </div>

                <!-- 登录表单 -->
                <div class="login-form">
                    <h1>Login</h1>
                    <span>Please enter your ID and password</span>

                    <div class="form">
                        <label>ID</label>
                        <input class="input-large" type="text" v-model="userId" />

                        <label> {{ t('usermng.password') }}</label>
                        <div class="password-field">
                            <input class="input-large" :type="showPassword ? 'text' : 'password'" v-model="password" />
                            <el-icon class="toggle-icon" @click="togglePassword">
                                <component :is="showPassword ? View : Hide" />
                            </el-icon>
                        </div>
                    </div>
                    <button class="login-button" @click="handleLogin">
                        {{ t('start') }}
                    </button>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElSelect, ElOption, ElIcon } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import { login } from '@/api/index'
import { useMenuStore } from '@/store/modules/useMenu'
import { useRouter } from 'vue-router'
const router = useRouter()
const menuStore = useMenuStore()

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// 登录数据
const userId = ref('')
const password = ref('')
const showPassword = ref(false)

// 支持语言列表
const languages = [
    { value: 'ja', label: '日本語' },
    { value: 'zhCn', label: '简体中文' }
]

// 处理语言切换
function changeLanguage(lang) {
    if (lang === 'zhCn') {
        locale.value = 'zh-CN'
    } else {
        locale.value = lang
    }
    localStorage.setItem('lang', lang)
}

// 登录图片根据语言切换
const loginImage = computed(() =>
    locale.value === 'ja' ? new URL('@/assets/login-ja.jpg', import.meta.url).href :
        new URL('@/assets/login-zh.jpg', import.meta.url).href
)

// 登录操作
const handleLogin = async () => {
    try {
        const langParam = locale.value === 'zh-CN' ? 'zh' : locale.value

        const res = await login({
            userid: userId.value,
            password: password.value,
            language: langParam
        })

        if (res && res.data?.userId) {
            // 保存 token 和用户信息
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userInfo', JSON.stringify({
                userId: res.data.userId,
                userName: res.data.userName
            }))

            // 更新 Pinia
            menuStore.userInfo = {
                userName: res.data.userName,
                userId: res.data.userId
            }

            // 跳转
            router.push({ name: 'dialog' })
        } else {
            alert('Login failed')
        }
    } catch (error) {
        // 如果是500错误，返回用户名密码不存在
        if (error.response?.status === 500) {
            alert('用户名或密码不存在')
        } else {
            console.error('Login error:', error)
            alert('Login error')
        }
    }
}
</script>


<style scoped lang="scss">
.main {
    background-color: white;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    display: flex;
    width: 100%;
    height: 100%;
}

.left-panel {
    flex: 2;
    margin-left: -20px;
    margin-top: -10px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
}

.right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    position: relative;
}

.language-switch {
    position: absolute;
    top: 10px;
    right: 10px;

    :deep(.el-select) {
        width: 120px;
    }
}

.login-form {
    margin-top: 80px;

    h1 {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin: 10px 0 5px;
        font-size: 18px;
    }

    .form {
        margin-top: 20px;
    }

    .input-large {
        width: 700px;
        height: 80px;
        padding: 20px;
        font-size: 24px;
        box-sizing: border-box;
        border-radius: 10px;
        border: 1px solid #ccc;
    }

    .login-button {
        margin-top: 30px;
        width: 700px;
        height: 80px;
        background-color: #34A0E9;
        border: none;
        border-radius: 20px;
        color: white;
        font-size: 28px;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        &:hover,
        &:active {
            background-color: #ADDEFF;
            color: #1D5276;
        }
    }


    .password-field {
        position: relative;
        display: flex;
        align-items: center;

        .input-large {
            padding-right: 50px;
        }

        .toggle-icon {
            position: absolute;
            right: 20px;
            cursor: pointer;
            font-size: 28px;
            color: #999;

            &:hover {
                color: #333;
            }
        }
    }
}
</style>