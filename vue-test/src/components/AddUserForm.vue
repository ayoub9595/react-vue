<script setup lang="ts">

import type { User } from '@/User';
import { reactive, ref } from 'vue';

const user = reactive<User>({
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  gender: 'MALE',
  role: 'ROLE_USER'})
const firstnameError = ref(false);
const lastnameError = ref(false);
const emailError = ref(false);
const birthdateError = ref(false);

const emit = defineEmits<{
  (e: 'add-user', user: User): void
}>();

const checkFirstname = () => {
    if(user.firstName.length === 0) {
        firstnameError.value = true
    } 
}
const checkLastname = () => {
    if(user.lastName.length === 0) {
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
    if(user.birthDate.length === 0) {
        birthdateError.value = true
    } 
}
const initialiseFirstname= () => firstnameError.value = false;
const initialiseLastname= () => lastnameError.value = false;
const initialiseBirthdate= () => birthdateError.value = false;
const initialiseEmail= () => emailError.value = false;

const handleSubmit = () => {
    checkFirstname()
    checkLastname()
    checkBirthdate()
    checkEmail();
    if(firstnameError.value || lastnameError.value || birthdateError.value) {
        return;
    }
    else {
        emit('add-user',user)
    }
    
    
}

</script>

<template>
  <div class="form-container">
    <h1>Add User</h1>
    <form @submit.prevent="handleSubmit">
      <label>First name:</label>
      <input @focus="initialiseFirstname"
             @blur="checkFirstname"
             :class="{['error-input']: firstnameError}"
             v-model="user.firstName"
      />
      <span v-if="firstnameError">Please enter a valid first name</span>
      <label>Last name:</label>
      <input @focus="initialiseLastname"
             @blur="checkLastname"
             :class="{['error-input']: lastnameError}" 
             v-model="user.lastName"
      />
      <span v-if="lastnameError">Please enter a valid last name</span>
      <label>Birthdate:</label>
      <input @focus="initialiseBirthdate"
             @blur="checkBirthdate" 
             type="date"
             :class="{['error-input']: birthdateError}" 
             v-model="user.birthDate"
      />
      <span v-if="birthdateError">Please enter a valid birthdate</span>
      <label>Email:</label>
      <input @focus="initialiseEmail"
             @blur="checkEmail" 
             :class="{['error-input']: emailError}" 
             v-model="user.email"
      />
      <span v-if="emailError">Please enter a valid email</span>
      <label>Gender:</label>
      <select v-model="user.gender">
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="NONE">None</option>
      </select>
      <button>Submit</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
    width: max-content;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 2px 2px 2px 2px gray;
    background: lightgreen;
}
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
input,
select {
  box-sizing: border-box;
  height: 35px;
  width: 200px;
  border-radius: 8px;
  border: 1px solid black;
  padding: 0 5px;
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
