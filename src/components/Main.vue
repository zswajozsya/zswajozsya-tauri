<script setup lang="ts">
import { usePageStackStore } from '../stores/index.ts'
import { readDir } from '../tauri';
import { ref, watch } from 'vue';
import { DirEntry } from '../types';

const pageStack = usePageStackStore();
const dirEntries = ref<DirEntry[]>([]);

watch(pageStack, async (newStack, _oldStack) => {
  if (newStack.stack !== null) {
    const lastPage = newStack.stack[newStack.stack.length - 1];
    dirEntries.value = await readDir(lastPage)
  }
})
</script>

<template>
  <div class="root">
    <div v-if="pageStack.stack === null">Loading...</div>
    <div v-else v-for="entry in dirEntries" class="entry">
      <span class="material-symbols-outlined">
        {{ entry.file_type === 'Dir' || entry.file_type === 'SymlinkDir' ? 'folder' : 'draft' }}
      </span>
      <span>{{ entry.file_name }}</span>
    </div>
  </div>
</template>

<style scoped>
.root {
  height: calc(100vh - 20px);
  overflow: scroll;
}

.entry {
  display: flex;
  align-items: center;

  span {
    text-wrap: nowrap;
  }
}
</style>
