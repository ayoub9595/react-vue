<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddUserForm from './components/AddUserForm.vue'
import UsersList from './components/UsersList.vue'
import type { User } from './User'
import {
  addUser,
  getAllUsers,
  transformFirebaseResponse,
} from './service/userService'
import BackDrop from './components/BackDrop.vue'
import type { FirebaseAddResponse } from './FirebaseRepsonse'
import ToasterMessage from './components/ToasterMessage.vue'
import { handleApiError, logError } from './utils/ErrorHandler'

const users = reactive<User[]>([])
const loading = ref(false)
const add = ref(true);
const showAdd = ref(false)

const handleAdd = () => {
  add.value = false
  showAdd.value = true
}

const handleDisableAdd = () => {
  add.value = true
  showAdd.value = false

}

const modal = reactive({
  show: false,
  class: '',
  title: '',
  message: '',
})

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

onMounted(async () => {
  loading.value = true
  try {
    const usersList = await getAllUsers()
    const transformedUsers = transformFirebaseResponse(usersList)
    users.length = 0
    users.push(...transformedUsers)
  } catch (error) {
    logError(error, 'fetchUsers')
    const errorResponse = handleApiError(error)
    updateModal({
      show: true,
      ...errorResponse,
    })
  } finally {
    loading.value = false
  }
})

const addNewUser = async (user: User) => {
  try {
    const data = (await addUser(user)) as FirebaseAddResponse
    updateModal({
      show: true,
      class: 'success',
      title: 'Success',
      message: 'User created successfully',
    })
    users.push({ ...user, id: data.name })
  } catch (error) {
    logError(error, 'addNewUser')
    const errorResponse = handleApiError(error)
    updateModal({
      show: true,
      ...errorResponse,
    })
  }
}
</script>

<template>
  <div class="container">
    <BackDrop v-if="loading" />
    <AddUserForm v-if="showAdd" @add-user="addNewUser" />
    <UsersList  :add="add"
                :users="users"
                @handle-add="handleAdd" 
                @handle-disable-add="handleDisableAdd" />
  </div>
  <ToasterMessage
    v-model:show="modal.show"
    :class="modal.class"
    :title="modal.title"
    :message="modal.message"
  />
</template>

<style scoped>
.container {
  display: flex;
  gap: 50px;
}
</style>