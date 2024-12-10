<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import AddUserForm from './components/AddUserForm.vue'
import UsersList from './components/UsersList.vue'
import type { User } from './User';
import { addUser, getAllUsers, transformFirebaseResponse } from './service/userService';
import BackDrop from './components/BackDrop.vue';
import type { FirebaseAddResponse } from './FirebaseRepsonse';


const users = reactive<User[]>([])

const loading = ref(false)


    onMounted(async() => {
    loading.value = true    
    try {
        const usersList = await getAllUsers();
        const transformedUsers = transformFirebaseResponse(usersList);
        users.length = 0;
        users.push(...transformedUsers)
    }
    catch(error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }

 })     

const addNewUser = async(user:User) => {
    try {
        const data = await addUser(user) as FirebaseAddResponse;
        users.push({...user,id: data.name})
        alert('User created succesfully')
    }
    catch(error){
        console.log(error)
    }
}

</script>

<template>
    <div class="container">
        <BackDrop v-if="loading" />
        <AddUserForm @add-user="addNewUser" />
        <UsersList :users="users" />
    </div>

</template>

<style scoped>
.container {
    display: flex;
    gap: 50px;
}
</style>
