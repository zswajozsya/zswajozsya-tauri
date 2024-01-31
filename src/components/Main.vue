<script setup lang="ts">
import { useUrlStore } from '../stores/index.ts'
import { readDir } from '../tauri';
import { ref, watch } from 'vue';
import { DirEntry } from '../types';

const DOUBLE_CLICK_INTERVAL = 500;
let doubleClickTimeoutId: number | undefined = undefined;

const urlStore = useUrlStore();
const dirEntries = ref<{
  selected: boolean,
  entry: DirEntry
}[]>([]);

watch(urlStore, async (newUrl, _oldUrl) => {
  if (newUrl.value !== null) {
    const res = await readDir(newUrl.path!);
    dirEntries.value = res.sort((a, b) => {
      const a_is_dir = a.file_type == 'Dir' || a.file_type == 'SymlinkDir';
      const b_is_dir = b.file_type == 'Dir' || b.file_type == 'SymlinkDir';
      if (a_is_dir && !b_is_dir) {
        return -1;
      } else if (!a_is_dir && b_is_dir) {
        return 1;
      }
      return 0;
    }).map(e => ({
      selected: false,
      entry: e
    }));
  }
})

const justClickedEntry = ref<string | null>(null);

function handleEntryDoubleClick(entry: DirEntry) {
  if (entry.file_type === 'Dir' || entry.file_type === 'SymlinkDir') {
    urlStore.value!.push(entry.file_name)
  } else {
    // TODO: Open the file
    console.log(entry.file_name)
  }
}

const handleClickEntry = (item: {
  selected: boolean,
  entry: DirEntry
}) => {
  item.selected = !item.selected;

  if (justClickedEntry.value === item.entry.file_name) {
    handleEntryDoubleClick(item.entry)

    justClickedEntry.value = null;
    clearTimeout(doubleClickTimeoutId);
  } else {
    clearTimeout(doubleClickTimeoutId);
    justClickedEntry.value = item.entry.file_name;
    doubleClickTimeoutId = setTimeout(() => {
      justClickedEntry.value = null
    }, DOUBLE_CLICK_INTERVAL);
  }
}
</script>

<template>
  <div class="root">
    <div v-if="urlStore.value === null">Loading...</div>
    <div v-else v-for="item in dirEntries" :class="`entry ${item.selected ? 'selected' : 'unselected'}`"
      @click="handleClickEntry(item)">
      <span class="material-symbols-outlined">
        {{ item.entry.file_type === 'Dir' || item.entry.file_type === 'SymlinkDir' ? 'folder' : 'draft' }}
      </span>
      <span>{{ item.entry.file_name }}</span>
    </div>
  </div>
</template>

<style scoped>
.root {
  height: calc(100vh - 60px);
  overflow-y: scroll;
  overflow-x: auto;
}

.entry {
  display: flex;
  align-items: center;

  span {
    text-wrap: nowrap;
  }

  &.selected {
    background-color: aqua;
  }
}
</style>
