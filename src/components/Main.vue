<script setup lang="ts">
import { usePathStore } from "../stores/path";
import { ref } from "vue";
import Tag from "primevue/tag";
import { DirEntry } from "../types";
import { stringifyPath, stringifySize } from "../utils";

const DOUBLE_CLICK_INTERVAL = 500;
let doubleClickTimeoutId: number | undefined = undefined;

const pathStore = usePathStore();

const justClickedEntry = ref<string | null>(null);

function handleEntryDoubleClick(entry: DirEntry) {
  if (entry.file_type === "Dir" || entry.file_type === "SymlinkDir") {
    const newPath = [...pathStore.path!, entry.file_name];
    pathStore.goTo(stringifyPath(newPath));
  } else {
    console.warn('TODO: Open the file', entry.file_name);
  }
}

const handleClickEntry = (entry: DirEntry) => {
  pathStore.selected_entry = entry.file_name;

  if (justClickedEntry.value === entry.file_name) {
    handleEntryDoubleClick(entry);

    justClickedEntry.value = null;
    clearTimeout(doubleClickTimeoutId);
  } else {
    clearTimeout(doubleClickTimeoutId);
    justClickedEntry.value = entry.file_name;
    doubleClickTimeoutId = setTimeout(() => {
      justClickedEntry.value = null;
    }, DOUBLE_CLICK_INTERVAL);
  }
};
</script>

<template>
  <div class="root">
    <div v-if="pathStore.path === null">Loading...</div>
    <div v-else class="list">
      <div
        v-for="entry in pathStore.entries"
        :class="`entry ${pathStore.selected_entry === entry.file_name ? 'selected' : ''}`"
        @click="handleClickEntry(entry)"
      >
        <div class="line1">
          <span class="icon material-symbols-outlined">
            {{
              entry.file_type === "Dir" ||
              entry.file_type === "SymlinkDir"
                ? "folder"
                : "draft"
            }}
          </span>
          <span class="name">{{ entry.file_name }}</span>
          <span
            class="size"
            v-text="stringifySize(entry.size)"
            v-if="
              entry.file_type !== 'Dir' &&
              entry.file_type !== 'SymlinkDir'
            "
          ></span>
        </div>
        <div class="line2">
          <Tag value="asdqwe"></Tag>
          <Tag value="qwe"></Tag>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  height: calc(100vh - 96px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.entry {
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  
  .line1 {
    display: flex;
    align-items: center;
    --size-width: 80px;
    .icon {
      margin-right: 4px;
    }

    .name {
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .size {
      width: var(--size-width);
      text-wrap: nowrap;
      text-align: right;
    }
  }

  .line2 {
    display: flex;
    column-gap: 8px;
  }

  &.selected {
    color: var(--highlight-text-color);
    background-color: var(--highlight-bg);
  }
}
</style>
