<script setup lang="ts">
import type { PropsType } from '@/PropsType'
import { ref, watch } from 'vue';
import EditIcon from './icons/EditIcon.vue';
import DelelteIcon from './icons/DelelteIcon.vue';
import { getCurrentUserInfo, isCurrentUser } from '../utils/tokenUtils';

const {isAdmin} = getCurrentUserInfo();

const editColor = ref<string[]>([]);
const deleteColor = ref<string[]>([]);

const props = withDefaults(defineProps<PropsType>(), {
  users: () => [],
  add: false
})

watch(() => props.users, (newUsers) => {
  editColor.value = new Array(newUsers.length).fill('#000000');
  deleteColor.value = new Array(newUsers.length).fill('#000000');
}, { immediate: true, deep: true });


const changeEditColor = (index: number, color: string) => {
  const newColors = [...editColor.value];
  newColors[index] = color;
  editColor.value = newColors;
}

const changeDeleteColor = (index: number, color: string) => {
  const newColors = [...deleteColor.value];
  newColors[index] = color;
  deleteColor.value = newColors;
}

const getRole = (role:string) => {
    return role.split('_')[1];
  }

const emit = defineEmits<{
  (e: 'handle-add'): void,
  (e:'handle-disable-add'): void,
  (e:'handle-edit',id: number): void,
  (e:'handle-delete',id: number): void,
}>();

const handleClick = () => {
  if(props.add) {
    emit('handle-add');
  }
  else {
    emit('handle-disable-add')
  }
}

const handleEdit = (strId: string | undefined) => {
  const id = strId ? parseInt(strId) : 0;
  emit('handle-edit',id)
}

const handleDelete = (strId: string | undefined) => {
  const id = strId ? parseInt(strId) : 0
  emit('handle-delete',id)
}
</script>

<template>
  <div class="list-container">
    <template v-if="props.users.length === 0">
      <h1>No users exists please add one</h1>
    </template>
    <template v-else>
      <button class="add-button" @click="handleClick" v-if="isAdmin">{{props.add ?'+': 'x'}}</button> 
      <h1>User List</h1>
      <table class="styled-table">
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Birthdate</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Role</th>
            <th v-if="isAdmin">...</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in props.users" :key="user.id">
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.birthDate }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.gender }}</td>
            <td>{{ getRole(user.role) }}</td>
            <td v-if="isAdmin">
              <EditIcon className="button"
                        :color="editColor[index]"
                        height="30px" 
                        width="30px"
                        @mouseenter="() => changeEditColor(index, '#FFFFFF')"
                        @mouseleave="() => changeEditColor(index, '#000000')"
                        @click="()=> handleEdit(user.id)" />
              <DelelteIcon v-if="!isCurrentUser(user.id!)" 
                        className="button"
                        :color="deleteColor[index]"
                        height="30px" 
                        width="30px"
                        @mouseenter="() => changeDeleteColor(index, '#FFFFFF')"
                        @mouseleave="() => changeDeleteColor(index, '#000000')"
                        @click="() =>handleDelete(user.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
.list-container {
  width: max-content;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 2px 2px 2px 2px gray;
  background: #ebdfda;
  position: relative;
}
.add-button {
  position: absolute;
  right: 10px;
  top: 10px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: yellow;
  color:black;
  transition: all 1s ease-in-out;
  cursor: pointer;
  border: none;
}
.add-button:hover {
  background: black;
  color:yellow;
  border: none;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
}
/* Styled borders */
.styled-table {
  border-radius: 8px;
  border: 1px solid black;
  border-collapse: separate;
  border-spacing: 0;
}

.styled-table th,
.styled-table td {
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  padding: 12px;
}

.styled-table th {
  background-color: yellow;
  font-weight: 600;
}

/* Remove last border */
.styled-table tr:last-child td {
  border-bottom: none;
}

.styled-table th:last-child,
.styled-table td:last-child {
  border-right: none;
}
.button {
  cursor: pointer;
}
</style>
