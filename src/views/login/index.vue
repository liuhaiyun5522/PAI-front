<template>
    <div class="main">
        <div class="container">
            <!-- 左侧图片（绑定动态语言图片） -->
            <div class="left-panel">
                <img :src="loginImage" />
            </div>

            <!-- 右侧登录面板 -->
            <div class="right-panel">
                <div class="language-switch">
                    <el-select v-model="currentLocale" @change="changeLanguage">
                        <el-option v-for="lang in languages" :key="lang.value" :label="lang.label"
                            :value="lang.value" />
                    </el-select>
                </div>

                <div class="login-form">
                    <span class="span-title">{{ t('login.title') }}</span>
                    <span class="span-prompt">{{ t('login.prompt') }}</span>

                    <div class="form">
                        <div class="ID">
                            <label>{{ t('login.userIdLabel') }}</label>
                            <el-input v-model="userId" class="input-large" :placeholder="t('login.userIdPlaceholder')"
                                clearable>
                                <template #prefix>
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                        <div class="password">
                            <label>{{ t('usermng.password') }}</label>
                            <div class="password-field">
                                <el-input v-model="password" class="input-large"
                                    :type="showPassword ? 'text' : 'password'"
                                    :placeholder="t('login.passwordPlaceholder')" clearable>
                                    <template #prefix>
                                        <el-icon>
                                            <Lock />
                                        </el-icon>
                                    </template>
                                    <template #suffix>
                                        <el-icon class="password-toggle-icon" @click="togglePassword">
                                            <component :is="showPassword ? View : Hide" />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </div>
                        </div>
                    </div>

                    <button class="login-button" @click="handleLogin">
                        {{ t('start') }}
                    </button>
                </div>

                <div class="version-info">version:v1.0.0</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { View, Hide, User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/index'
import { useMenuStore } from '@/store/modules/useMenu'

const router = useRouter()
const menuStore = useMenuStore()
const { t, locale } = useI18n()

const userId = ref('')
const password = ref('')
const showPassword = ref(false)
const currentLocale = ref(localStorage.getItem('lang') || 'ja')

const languages = [
    { value: 'ja', label: '日本語' },
    { value: 'zh-CN', label: '简体中文' }
]

const changeLanguage = (selectedLangValue) => {
    locale.value = selectedLangValue
    currentLocale.value = selectedLangValue
    localStorage.setItem('lang', selectedLangValue)
}

const loginImage = computed(() => {
    if (locale.value === 'ja') return new URL('@/assets/login-ja.png', import.meta.url).href
    if (locale.value === 'zh-CN') return new URL('@/assets/login-zh.png', import.meta.url).href
    return new URL('@/assets/login-default.jpg', import.meta.url).href
})

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    try {
        const langParam = locale.value === 'zh-CN' ? 'zh' : locale.value
        // const res = await login({
        //     userid: userId.value,
        //     password: password.value,
        //     language: langParam
        // })
        const res = await login({
            email: userId.value,
            password: password.value
        })

        if (res && res.data?.userId) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userInfo', JSON.stringify({
                userId: res.data.userId,
                userName: res.data.userName,
                userEmail:res.data.email,
                userPermissionLevel:res.data.permissionLevel,
            }))

            menuStore.userInfo = {
                userId: res.data.userId,
                userName: res.data.userName,
                userEmail:res.data.userName,
                userPermissionLevel:res.data.permissionLevel
            }

            ElMessage.success(t('login.loginSuccessMessage'))
            setTimeout(() => router.push({ name: 'dialog' }), 1000)
        } else {
            ElMessage.error(t('login.loginFailed'))
        }
    } catch (error) {
        const msg = error.response?.status === 500
            ? t('login.userOrPasswordIncorrect')
            : t('login.loginError')
        alert(msg)
    }
}


</script>

<style scoped lang="scss">
.main {
    height: 100vh;
    padding: 20px;
    background-color: #FFF;

    .container {
        display: flex;
        width: 100%;
        height: 100%;
        padding: 0;

        .left-panel {
            img {
                height: 100%;
                border-radius: 20px;
            }
        }

        .right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px 40px;
            position: relative;

            .language-switch {
                position: absolute;
                top: 10px;
                right: 10px;

                :deep(.el-select) {
                    width: 120px;
                }
            }

            .login-form {
                width: 100%;
                max-width: 500px;

                .span-title {
                    font-size: 35px;
                }

                .span-prompt {
                    display: block;
                    font-size: 17px;
                    color: #5F7698;
                    margin-bottom: 40px;
                }

                .form {
                    margin-top: 20px;
                    .ID {
                        label {
                            font-size: 17px;
                            color: #5F7698;
                        }
                    }
                    .password {
                        margin-top: 35px;

                        label {
                            margin-top: 20px;
                            font-size: 17px;
                            color: #5F7698;
                        }
                    }
                }

                .input-large {
                    width: 500px;
                    height: 50px;
                    font-size: 16px;
                    margin-bottom: 20px;
                    margin-top: 5px;

                    .el-icon {
                        font-size: 20px;
                        color: #909399;
                    }

                    :deep(.el-input__wrapper) {
                        padding: 0 10px;
                        border-radius: 10px;
                        height: 100%;
                        border: 1px solid #AFBCCD;
                        background-color: white;
                        display: flex;
                        box-shadow: none;
                    }
                }

                .login-button {
                    margin-top: 70px;
                    width: 500px;
                    height: 50px;
                    background-color: #34A0E9;
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 17px;
                    cursor: pointer;

                    &:hover,
                    &:active {
                        background-color: #ADDEFF;
                        color: #1D5276;
                    }
                }
            }
        }
    }
}

.version-info {
    position: absolute;
    bottom: 0;
    right: 0;
    font-family: '微软雅黑', 'Microsoft YaHei', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #1D5276;
    text-align: left;
    width: 91px;
    height: 19px;
}
</style>