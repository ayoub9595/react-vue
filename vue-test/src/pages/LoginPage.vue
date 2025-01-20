<script setup lang="ts">
import ToasterMessage from '@/components/ToasterMessage.vue'
import { authenticate, refreshToken } from '@/service/authenticationService'
import { getAccessToken, getRefreshToken, setAuthTokens } from '@/utils/authUtils'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const router = useRouter()

const loginRequest = reactive({ email: '', password: '' })

const emailError = ref(false)
const passwordError = ref(false)

const modal = reactive({ show: false, class: '', title: '', message: '' })

const isLoading = ref(true);

const updateModal = (newModalState: typeof modal) => {
  modal.show = newModalState.show
  modal.class = newModalState.class
  modal.title = newModalState.title
  modal.message = newModalState.message

  if (modal.show) {
    setTimeout(() => {
      modal.show = false
    }, 5000)
  }
}

onMounted(() => {
        const checkAuth = async () => {
            const accessToken = getAccessToken();
            const refreshTokenStr = getRefreshToken();

            if (!accessToken && !refreshTokenStr) {
                isLoading.value = false;
                return;
            }
            try {
                if (accessToken) {
                    // Verify token validity by making a test request
                    const response = await fetch('http://localhost:8080/api/users', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (response.ok) {
                        router.push('/home');
                        return;
                    }
                }

                // If access token is invalid or missing, try refresh token
                if (refreshTokenStr) {
                    const response = await refreshToken({ refreshToken: refreshTokenStr });
                    setAuthTokens(response);
                    router.push('/home');
                    return;
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_error) {
                localStorage.clear();
            } finally {
                isLoading.value = false;
            }
        };

        checkAuth();
    });

const checkEmail = () => {
  if (!emailRegex.test(loginRequest.email)) {
    emailError.value = true
  }
}
const resetEmail = () => (emailError.value = false)

const checkPassword = () => {
  if (loginRequest.password.length === 0) {
    passwordError.value = true
  }
}
const resetPassword = () => (passwordError.value = false)

const hideModal = () => (modal.show = false)

const handleSubmit = async () => {
  try {
    checkEmail()
    checkPassword()
    if (emailError.value || passwordError.value) {
      return
    }
    const response = await authenticate(loginRequest)
    setAuthTokens(response);
    router.push('/home');
  } catch (error) {
    const message = (error instanceof Error && error.message !== 'Unexpected end of JSON input') 
                ? error.message 
                : 'Email or password is not correct';
            
            updateModal({
                show: true,
                class: "danger",
                title: "Error",
                message
            });
  }
}
</script>

<template>
    <div v-cloak v-if="!isLoading" class="parent">
      <ToasterMessage
        :show="modal.show"
        :class="modal.class"
        :title="modal.title"
        :message="modal.message"
        @hideModal="hideModal"
      />
      <div class="container">
        <h1>Login</h1>
        <form class="form" @submit.prevent="handleSubmit">
          <label>Email:</label>
          <input
            v-model="loginRequest.email"
            :class="{ input: true, ['error-input']: emailError }"
            @blur="checkEmail"
            @focus="resetEmail"
          />
          <span v-if="emailError">Email is not valid</span>
          <label>Password:</label>
          <input
            v-model="loginRequest.password"
            type="password"
            :class="{ input: true, ['error-input']: passwordError }"
            @blur="checkPassword"
            @focus="resetPassword"
          />
          <span v-if="passwordError">Password cannot be empty</span>
          <button class="button">Connect</button>
        </form>
      </div>
    </div>
  </template>

<style scoped>
[v-cloak] {
  display: none;
}
.parent {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  position: relative;
  background: wheat;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 2px 2px 2px 2px gray;
  background: white;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.input {
  box-sizing: border-box;
  height: 35px;
  width: 300px;
  border-radius: 8px;
  border: 1px solid black;
  padding: 0 5px;
}

.button {
  height: 30px;
  width: 100px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: black;
  color: white;
}

.error-input {
  border: 1px solid red;
  background: lightsalmon;
}
span {
  color: red;
  font-weight: bold;
}
</style>
