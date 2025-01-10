<script setup lang="ts">
const emit = defineEmits<{
  (e: 'handle-delete'): void
  (e: 'handle-cancel-delete'): void
}>()

const handleYes = () => {
  emit('handle-delete')
}

const handleNo = () => {
  emit('handle-cancel-delete')
}
</script>

<template>
  <div class="backdrop">
    <div class="container">
      <div class="title">
        <span>Alert</span>
        <span class="exit" @click="handleNo">X</span>
      </div>
      <div class="description">
        <p>Are you sure you want to delete this user</p>
      </div>
      <div class="buttons">
        <button class="button yes-button" @click="handleYes">Yes</button>
        <button class="button no-button" @click="handleNo">No</button>
      </div>
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
.container {
  height: 200px;
  width: 500px;
  background: gainsboro;
  border-radius: 20px;
}
.title {
  padding: 10px 20px;
  border-bottom: 1px solid black;
  font-size: 1.7rem;
  display: flex;
  justify-content: space-between;
}
.exit {
  cursor: pointer;
}
.description {
  padding: 10px 20px;
  font-size: 1.2rem;
}
.buttons {
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}
.button {
  border: none;
  height: 30px;
  width: 100px;
  border-radius: 10px;
  cursor: pointer;
}
.yes-button {
  background: lightgreen;
}

.no-button {
  background: lightcoral;
  color: white;
}
</style>
