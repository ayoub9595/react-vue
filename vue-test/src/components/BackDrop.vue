<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue';
</script>

<template>
    <div class="backdrop">
        <LoadingSpinner />
    </div>
</template>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>