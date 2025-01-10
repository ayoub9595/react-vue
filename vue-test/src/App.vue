<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddUserForm from './components/AddUserForm.vue'
import UsersList from './components/UsersList.vue'
import type { User } from './User'
import { addUser, deleteUserById, getAllUsers } from './service/userService'
import BackDrop from './components/BackDrop.vue'
import ToasterMessage from './components/ToasterMessage.vue'
import EditUserForm from './components/EditUserForm.vue'
import { updateUser } from './service/userService'
import DeleteUser from './components/DeleteUser.vue'

const users = reactive<User[]>([])
const loading = ref(false)
const add = ref(true)
const showAdd = ref(false)
const showEdit = ref(false)
const userIdtoEdit = ref(0)
const showDelete = ref(false)
const userIdtoDelete = ref(0)

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
    users.push(...usersList)
  } catch (error) {
    updateModal({
      show: true,
      class: 'danger',
      title: 'Erreur',
      message: error as string,
    })
  } finally {
    loading.value = false
  }
})

const addNewUser = async (user: User) => {
  try {
    const addedUser = await addUser(user)
    updateModal({
      show: true,
      class: 'success',
      title: 'Success',
      message: 'User created successfully',
    })
    users.push({ ...addedUser })
  } catch (error) {
    updateModal({
      show: true,
      class: 'danger',
      title: 'Erreur',
      message: error as string,
    })
  }
}
const handleEdit = (id: number) => {
  showEdit.value = true
  userIdtoEdit.value = id
}
const handleExitEditForm = () => {
  showEdit.value = false
}
const updateExistingUser = async (user: User) => {
  try {
    const updatedUser = await updateUser(user)
    const index = users.findIndex(u => u.id === updatedUser.id)
    users[index] = updatedUser
    showEdit.value = false
    updateModal({
      show: true,
      class: 'success',
      title: 'Success',
      message: 'User modified successfully',
    })
  } catch (error) {
    updateModal({
      show: true,
      class: 'danger',
      title: 'Erreur',
      message: error as string,
    })
  }
}
const handleDelete = (id: number) => {
  userIdtoDelete.value = id
  showDelete.value = true
}
const deleteUser = async () => {
  try {
    await deleteUserById(userIdtoDelete.value)
    const index = users.findIndex(
      user => user.id == userIdtoDelete.value.toString(),
    )
    users.splice(index, 1)
    updateModal({
      show: true,
      class: 'success',
      title: 'Success',
      message: 'User deleted successfully',
    })
  } catch (error) {
    updateModal({
      show: true,
      class: 'danger',
      title: 'Erreur',
      message: error as string,
    })
  } finally {
    showDelete.value = false
  }
}
const hideDeleteUser = () => {
  showDelete.value = false
}
</script>

<template>
  <div class="container">
    <BackDrop v-if="loading" />
    <AddUserForm v-if="showAdd" @add-user="addNewUser" />
    <UsersList
      :add="add"
      :users="users"
      @handle-add="handleAdd"
      @handle-disable-add="handleDisableAdd"
      @handle-edit="handleEdit"
      @handle-delete="handleDelete"
    />
  </div>
  <ToasterMessage
    v-model:show="modal.show"
    :class="modal.class"
    :title="modal.title"
    :message="modal.message"
  />
  <EditUserForm
    v-if="showEdit"
    :id="userIdtoEdit"
    @handle-exit="handleExitEditForm"
    @update-user="updateExistingUser"
  />
  <DeleteUser
    v-if="showDelete"
    @handle-delete="deleteUser"
    @handle-cancel-delete="hideDeleteUser"
  />
</template>

<style scoped>
.container {
  display: flex;
  gap: 50px;
}
</style>
