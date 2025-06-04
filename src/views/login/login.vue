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
                    <!-- 新代码  -->
                    <el-select v-model="currentLocale" @change="changeLanguage" placeholder="选择语言">
                        <el-option v-for="lang in languages" :key="lang.value" :label="lang.label"
                            :value="lang.value" />
                    </el-select>

                </div>

                <!-- 登录表单 -->
                <div class="login-form">

                    <!-- 新代码  -->
                    <h1>{{ t('login.title') }}</h1>
                    <span>{{ t('login.prompt') }}</span>

                    <div class="form">
                        <label>{{ t('login.userIdLabel') }}</label>
                        <el-input v-model="userId" class="input-large" :placeholder="t('login.userIdPlaceholder')"
                            clearable>
                            <template #prefix>
                                <el-icon>
                                    <User />
                                </el-icon>
                            </template>
                        </el-input>

                        <label>{{ t('usermng.password') }}</label>
                        <div class="password-field">
                            <el-input v-model="password" class="input-large" :type="showPassword ? 'text' : 'password'"
                                :placeholder="t('login.passwordPlaceholder')" clearable>
                                <template #prefix>
                                    <el-icon>
                                        <Lock />
                                    </el-icon>
                                </template>
                                <template #suffix>
                                    <el-icon class="password-toggle-icon" @click="togglePassword"
                                        style="cursor: pointer;">
                                        <component :is="showPassword ? View : Hide" />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <button class="login-button" @click="handleLogin">
                        {{ t('start') }} </button>
</div>
                <div class="login-form"></div>
                <div class="version-info">version:v1.0.0</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'  // 移除了 watch，因为不再直接 watch locale
// ElInput, User, Lock 是新增的
import { ElSelect, ElOption, ElIcon, ElInput, ElMessage } from 'element-plus'
// User, Lock 是新增的图标
import { View, Hide, User, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/index'
import { useMenuStore } from '@/store/modules/useMenu'
import { useRouter } from 'vue-router'
const router = useRouter()
const menuStore = useMenuStore()

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()  // locale 来自 useI18n，会直接被修改

// 登录数据
const userId = ref('')
const password = ref('')
const showPassword = ref(false)

// 支持语言列表
const languages = [
    { value: 'ja', label: '日本語' },
    { value: 'zh-CN', label: '简体中文' }
]

// 当前选中的语言，用于 el-select 的 v-model
// 初始化时尝试从 localStorage 获取，否则使用默认语言（例如 'ja'）

const currentLocale = ref(localStorage.getItem('lang') || 'ja')

// 设置初始语言
onMounted(() => {
    const savedLang = localStorage.getItem('lang')
    if (savedLang && languages.some(lang => lang.value === savedLang)) {
        locale.value = savedLang // 设置 i18n 的 locale
        currentLocale.value = savedLang // 更新选择器的显示
    } else {
        // 如果 localStorage 没有或无效，则设置一个默认语言
        locale.value = 'ja' // 默认日语
        currentLocale.value = 'ja'
        localStorage.setItem('lang', 'ja') // 同时保存到 localStorage
    }
})

// 处理语言切换
function changeLanguage(selectedLangValue) {
    locale.value = selectedLangValue // 直接更新 i18n 的 locale
    currentLocale.value = selectedLangValue // 更新 el-select 的绑定值
    localStorage.setItem('lang', selectedLangValue) // 保存到 localStorage
}

const loginImage = computed(() => {
    // 直接使用 locale.value 进行判断
    if (locale.value === 'ja') {
        return new URL('@/assets/login-ja.png', import.meta.url).href
    } else if (locale.value === 'zh-CN') {
        return new URL('@/assets/login-zh.png', import.meta.url).href
    }
    // 可以添加一个默认图片，以防 locale.value 不是预期的值
    return new URL('@/assets/login-default.jpg', import.meta.url).href // 假设有一个默认图片
})

// 切换密码可见性
const togglePassword = () => {
    showPassword.value = !showPassword.value
}

// 登录操作
async function handleLogin() {
    try {
        // API 期望的语言参数，'zh-CN' 对应 'zh'，'ja' 对应 'ja'
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

            // 使用 ElMessage 显示成功提示
            ElMessage.success(t('login.loginSuccessMessage'));

            // （可选）延迟一小段时间再跳转，以便用户可以看到成功消息
            setTimeout(() => {
                router.push({ name: 'dialog' });
            }, 1000); // 延迟 1 秒 (1000毫秒)

            // 跳转
            router.push({ name: 'dialog' })
        } else {
            // 登录失败 (例如，API 返回了表示失败的响应，但不是服务器错误)
            // 这里的具体判断逻辑可能需要根据您的 API 响应结构来调整
            ElMessage.error(t('login.loginFailed'));
        }
    } catch (error) {
        if (error.response?.status === 500) {
            // 使用 i18n翻译提示信息
            alert(t('login.userOrPasswordIncorrect')) // 假设你在 i18n 文件中定义了 login.userOrPasswordIncorrect
        } else {
            console.error('Login error:', error)
            // 使用 i18n翻译提示信息
            alert(t('login.loginError')) // 假设你在 i18n 文件中定义了 login.loginError
        }
    }
}

// window.tempElMessage = ElMessage;
// window.tempT = t;

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
    margin-left: 0;
    margin-top: 0;
    display: flex; // 新增
    justify-content: flex-start; // 新增，水平居中
    align-items: flex-start; // 新增，垂直居中
    overflow: hidden; // 新增，如果图片过大时（虽然 contain 会使其适应），确保不溢出圆角
    border-radius: 20px;
    box-sizing: border-box; // 明确指定，使padding包含在flex计算的宽度内

    img {
        max-width: 100%;
        max-width: 100%;
        object-fit: contain;
        border-radius: 20px;
        display: block;     // 消除图片下方可能存在的额外空白，并使其表现更像一个块级元素
    }
}

.right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center; // 新增：垂直居中其直接子元素（即 .login-form 块）
    align-items: center;   // 新增：水平居中其直接子元素（即 .login-form 块）
    padding: 20px 40px;
    position: relative;
}

.version-info {
        position: absolute; // 相对于 .right-panel 进行定位
        bottom: 0px; // 距离 .right-panel 底部 20px (您可以根据视觉效果微调)
        right: 0px; // 距离 .right-panel 右侧 20px (您可以根据视觉效果微调)

        // --- 从设计稿更新的文本样式 ---
        font-family: '微软雅黑', 'Microsoft YaHei', sans-serif; // 字体设置为微软雅黑，并提供备用字体
        font-weight: 400; // 字重 (400 通常是 normal/常规)
        font-size: 14px; // 字号
        line-height: 18px; // 行高
        letter-spacing: 0px; // 字间距 (0px 通常是 normal/常规)
        color: #1D5276; // 文字颜色

        // --- 关于尺寸和对齐 ---
        text-align: left; // 文本左对齐 (对于单行LRT文本，这通常是默认行为)
        width: 91px; // (可选) 如果需要严格固定宽度，可以设置。通常文本内容决定宽度。
        height: 19px; // (可选) 如果需要严格固定高度，可以设置。通常行高和字号决定高度。
    }

.language-switch {
    position: absolute;
    top: 10px;
    right: 10px;

    :deep(.el-select) {
        width: 120px;
    }

    .el-input__inner {
        font-size: 16px; // 示例：调整为您期望的字号
    }
}

.login-form {
    // margin-top: 80px;
    margin-top: 0;      // 例如，设置为 0
    width: 100%;        // 允许 .login-form 占据可用宽度
    max-width: 500px;   // 重要：设置一个最大宽度，与您输入框/按钮的宽度一致或稍大
                        // 这使得 .login-form 块本身可以在 .right-panel 中水平居中

    h1 {
        margin-bottom: 20px;
        // 新增/修改：调整登录大标题的字号
        font-size: 48px;
        font-family: 'Microsoft YaHei';
        font-weight: '400';
    }

    span {
        display: block; // 确保 margin 生效
        font-size: 20px; // 示例：调整为您期望的字号
        color: #606266; // 示例文字颜色
        margin-bottom: 30px; // 根据需要调整与下方表单的间距
    }

    label {
        display: block;
        margin: 10px 0 5px;
        font-size: 20px;
        font-family: 'Microsoft YaHei';
        font-weight: '400';
    }

    .form {
        margin-top: 20px;
    }

    .input-large {
        // 这个类现在应用在 el-input 组件上
        width: 500px;
        height: 60px; // el-input 的高度主要由其内部元素和 line-height 控制
        font-size: 24px; // 这个会影响 el-input 内的字体大小
        margin-bottom: 20px; // 为输入框之间增加一些间距（可选）

        // 使用 :deep() 来调整 Element Plus 组件的内部样式
        :deep(.el-input__wrapper) {
            padding: 0; // 重置内部 wrapper 的 padding，因为图标通过 slot 添加
            border-radius: 10px; // 应用到包裹层
            height: 100%; // 使 wrapper 撑满 el-input 的高度
            border: 1px solid #ccc; //  <--- 关键：给 wrapper 设置统一边框
            background-color: white; // 统一的背景色
            display: flex; // 确保 prepend 和 inner 元素水平排列
            overflow: hidden; // 确保子元素的圆角不会溢出
            box-shadow: none; // 清除 Element Plus 可能的默认阴影
        }

        :deep(.el-input__prefix) {
            // prefix 插槽的容器
            padding: 0 10px 0 20px; // 内边距: 上 右 下 左 (左侧多一些给图标)
            display: flex;
            align-items: center; // 确保图标垂直居中

            .el-icon {
                font-size: 21px; // 图标大小 (可以调整)
                color: #909399; // 图标颜色 (可以调整)
            }
        }

        :deep(.el-input__inner) {
            height: 100%;
            flex-grow: 1; // 占据剩余空间
            padding: 0 20px; // 输入文字的左右内边距
            font-size: 16px;
            border: none; // 内部输入框不需要边框，由 wrapper 控制
            border-radius: 0; // 内部输入框不需要单独圆角
            background-color: transparent; // 透明背景，显示 wrapper 的背景色
            color: #333; // 输入文字颜色

            &::placeholder {
                // 占位符文字样式
                color: #a8abb2;
                font-size: 16px;
                font-family: 'Microsoft YaHei';
                font-weight: '400';
            }
        }

        // 针对密码输入框的查看密码图标进行微调（如果需要）
        // 密码框的 "显示密码" 图标样式 (如果使用了 el-input 的 show-password)
        :deep(.el-input__suffix) {
            display: flex;
            align-items: center;
            padding-right: 15px; // 图标的右边距

            .el-input__suffix-inner {
                display: flex;
                align-items: center;
            }

            .password-toggle-icon.el-icon {
                font-size: 22px;
                color: #999;
                cursor: pointer;

                &:hover {
                    color: #333;
                }
            }
        }
    }

    .login-button {
        margin-top: 30px;
        width: 500px;
        height: 60px;
        background-color: #34A0E9;
        border: none;
        border-radius: 20px;
        color: white;
        font-family: '思源黑体';
        font-size: 20px;
        font-weight: 400;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        &:hover,
        &:active {
            background-color: #ADDEFF;
            color: #1D5276;
        }
    }
}
</style>