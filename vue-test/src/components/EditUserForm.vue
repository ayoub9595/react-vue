<script setup lang="ts">
import { getUserById } from '@/service/userService';
import type { User } from '@/User'
import { reactive, ref, watchEffect } from 'vue'

const props = withDefaults(defineProps<{id: number}>(),{
    id: 0,
})

const emit = defineEmits<{
  (e: 'handle-exit'): void;
  (e: 'update-user', user: User): void
}>();



const user = reactive<User>({
  id: '0',
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  gender: '',
})
const firstnameError = ref(false)
const lastnameError = ref(false)
const emailError = ref(false)
const birthdateError = ref(false)

watchEffect(async() => {
    try {
        const fetchedUser = await getUserById(props.id);
        Object.assign(user,fetchedUser) 
    }catch(error) {
        console.error(error)
    }

})

const handleExitClick = () => {
    emit('handle-exit');
}


const checkFirstname = () => {
  if (user.firstName.length === 0) {
    firstnameError.value = true
  }
}
const checkLastname = () => {
  if (user.lastName.length === 0) {
    lastnameError.value = true
  }
}

const checkEmail = () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(user.email)) {
    emailError.value = true
  }
}

const checkBirthdate = () => {
  if (user.birthDate.length === 0) {
    birthdateError.value = true
  }
}
const initialiseFirstname = () => (firstnameError.value = false)
const initialiseLastname = () => (lastnameError.value = false)
const initialiseBirthdate = () => (birthdateError.value = false)
const initialiseEmail = () => (emailError.value = false)

const handleSubmit = () => {
  checkFirstname()
  checkLastname()
  checkBirthdate()
  checkEmail()
  if (firstnameError.value || lastnameError.value || birthdateError.value) {
    return
  } else {
    emit('update-user',user)
  }
}
</script>

<template>
  <div class="backdrop">
    <div class="form-container">
      <div class="header">
        <h1 id="title">Edit User</h1>
        <div id="exit" @click="handleExitClick">X</div>
      </div>  
      <form @submit.prevent="handleSubmit">
        <div class="form-inputs">
          <div class="form-group">
            <label>First name:</label>
            <input
              @focus="initialiseFirstname"
              @blur="checkFirstname"
              :class="{ ['error-input']: firstnameError }"
              v-model="user.firstName"
            />
            <span v-if="firstnameError">Please enter a valid first name</span>
          </div>
          <div class="form-group">
            <label>Last name:</label>
            <input
              @focus="initialiseLastname"
              @blur="checkLastname"
              :class="{ ['error-input']: lastnameError }"
              v-model="user.lastName"
            />
            <span v-if="lastnameError">Please enter a valid last name</span>
          </div>
          <div class="form-group">
            <label>Birthdate:</label>
            <input
              @focus="initialiseBirthdate"
              @blur="checkBirthdate"
              type="date"
              :class="{ ['error-input']: birthdateError }"
              v-model="user.birthDate"
            />
            <span v-if="birthdateError">Please enter a valid birthdate</span>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input
              @focus="initialiseEmail"
              @blur="checkEmail"
              :class="{ ['error-input']: emailError }"
              v-model="user.email"
            />
            <span v-if="emailError">Please enter a valid email</span>
          </div>
          <div id="select-div" class="form-group">
            <label>Gender:</label>
            <select v-model="user.gender">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NONE">None</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <button >Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-container {
  width: max-content;
  border-radius: 20px;
  padding: 20px;
  background: gainsboro;
}
.header {
    display: flex;
    justify-content: space-between;
}
#title{
    padding: 0;
}
#exit {
    cursor: pointer;
    font-size: 2rem;
}
form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}
.form-inputs {
    display: grid;
  grid-template-columns: repeat(2, 300px);
  gap: 10px;
  width: 700px;
  justify-content: center;
}
.form-group {
  display: flex;
  flex-direction: column;
}
input,
select {
  box-sizing: border-box;
  height: 35px;
  width: 300px;
  border-radius: 8px;
  border: 1px solid black;
  padding: 0 5px;
}
#select-div {
  align-self: flex-start;
}
.error-input {
  border: 1px solid red;
  background: lightsalmon;
}
button {
  height: 30px;
  width: 100px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: black;
  color: white;
}
button:hover {
  background: white;
  color: black;
  border: 1px solid black;
}
span {
  color: red;
  font-weight: bold;
}
</style>
