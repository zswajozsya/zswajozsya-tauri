<script setup lang="ts">
import { usePageStackStore } from '../stores/index.ts'

const pageStack = usePageStackStore()
pageStack.init();
</script>

<template>
  <div>
    <div v-if="pageStack.stack === null">Loading...</div>
    <div v-else>{{ pageStack.stack[pageStack.stack.length - 1] }}</div>
  </div>
</template>

<style scoped></style>
