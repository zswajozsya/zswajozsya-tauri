<script setup lang="ts">
import { useUrlStore } from '../stores/index.ts'
import Button from 'primevue/button';

const urlStore = useUrlStore()
urlStore.init();
</script>

<template>
  <div class="root">
    <Button :disabled="urlStore.value === null || urlStore.value.length === 1" @click="urlStore.value!.pop()">
      <span class="material-symbols-outlined">arrow_upward</span>
    </Button>
    <div v-if="urlStore.value === null">Loading...</div>
    <div v-else>{{ urlStore.pathString }}</div>
  </div>
</template>

<style scoped>
.root {
  display: flex;
  align-items: center;
}
</style>
