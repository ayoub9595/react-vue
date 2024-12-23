<script setup lang="ts">
 withDefaults(defineProps<{
    height: string;
    width: string;
    className: string;
    color: string;
 }>(), {
});

const emit = defineEmits<{
  (e: 'onMouseEnter'): void,
  (e:'onMouseLeave'): void
}>();
const onMouseEnter = () => {
    emit('onMouseEnter')
}

const onMouseLeave = () => {
    emit('onMouseLeave')
}
</script>



<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <path
      d="M4 7H20"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
