<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AddUserForm from '../components/AddUserForm.vue'
import UsersList from '../components/UsersList.vue'
import type { User } from '../User'
import { addUser, deleteUserById, getUsers } from '../service/userService'
import BackDrop from '../components/BackDrop.vue'
import ToasterMessage from '../components/ToasterMessage.vue'
import EditUserForm from '../components/EditUserForm.vue'
import { updateUser } from '../service/userService'
import DeleteUser from '../components/DeleteUser.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import { clearAuthTokens } from '@/utils/authUtils'
import router from '@/router'

const users = reactive<User[]>([])
const loading = ref(false)
const add = ref(true)
const showAdd = ref(false)
const showEdit = ref(false)
const userIdtoEdit = ref(0)
const showDelete = ref(false)
const userIdtoDelete = ref(0)
const logoutColor = ref('#FFF');

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
    const usersList = await getUsers()
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
const handleLogoutClick = () => {
  clearAuthTokens();
  router.push('/')
}
</script>

<template>
  <div class="home-page">
    <div class="container">
      <BackDrop v-if="loading" />
      <AddUserForm v-if="showAdd" @add-user="addNewUser" />
      <button class="logout-button"
              @mouseleave="() => logoutColor = ('#FFF')"
              @mouseenter="() => logoutColor = ('#000')"
              @click="handleLogoutClick">
        <LogoutIcon height="40px" width="40px" :color="logoutColor" />
      </button>
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
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 50px;
}
.logout-button {
    position: fixed;
    top: 0;
    right: 0;
    margin: 20px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: lightsalmon;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
}
</style>
