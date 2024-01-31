<script setup lang="ts">
import { usePathStore } from "../stores/index.ts";
import { ref } from "vue";
import { DirEntry } from "../types";
import { stringifyPath } from "../utils";

const DOUBLE_CLICK_INTERVAL = 500;
let doubleClickTimeoutId: number | undefined = undefined;

const pathStore = usePathStore();

const justClickedEntry = ref<string | null>(null);

function handleEntryDoubleClick(entry: DirEntry) {
  if (entry.file_type === "Dir" || entry.file_type === "SymlinkDir") {
    const newPath = [...pathStore.path!, entry.file_name];
    pathStore.goTo(stringifyPath(newPath));
  } else {
    // TODO: Open the file
    console.log(entry.file_name);
  }
}

const handleClickEntry = (item: { selected: boolean; entry: DirEntry }) => {
  item.selected = !item.selected;

  if (justClickedEntry.value === item.entry.file_name) {
    handleEntryDoubleClick(item.entry);

    justClickedEntry.value = null;
    clearTimeout(doubleClickTimeoutId);
  } else {
    clearTimeout(doubleClickTimeoutId);
    justClickedEntry.value = item.entry.file_name;
    doubleClickTimeoutId = setTimeout(() => {
      justClickedEntry.value = null;
    }, DOUBLE_CLICK_INTERVAL);
  }
};
</script>

<template>
  <div class="root">
    <div v-if="pathStore.path === null">Loading...</div>
    <div
      v-else
      v-for="item in pathStore.entries"
      :class="`entry ${item.selected ? 'selected' : 'unselected'}`"
      @click="handleClickEntry(item)"
    >
      <span class="material-symbols-outlined">
        {{
          item.entry.file_type === "Dir" ||
          item.entry.file_type === "SymlinkDir"
            ? "folder"
            : "draft"
        }}
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
