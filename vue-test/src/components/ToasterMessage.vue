<script setup lang="ts">
interface Props {
  show: boolean;
  class?: string;
  title: string;
  message: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:show': [value: boolean]
}>();

const hideModal = () => {
  emit('update:show', false);
}

</script>

<template>
  <div :class="{['container-toaster']: true,show,[props.class as string]: !!props.class}">
    <div class="title">
      <span>{{title}}</span>
      <span class="exit" @click="hideModal">X</span>
    </div>
    <div class="body">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
.container-toaster {
    width: 300px;
    border: 1px solid black;
    border-radius: 10px;
    position: fixed;
    top: 0;
    right: 0;
    transform: translateX(100%);
    transition: all 1s ease-in-out;
}
.show {
    transform: translateX(0);
    top: 10px;
    right: 10px;
}

.title {
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.exit {
    cursor: pointer
}

.body {
    padding: 20px;
}


.danger {
    background: red;
    color: white;
}

.danger span {
    color: white;
}

.success {
    background: green;
}

.success span {
    color: white;
}

</style>