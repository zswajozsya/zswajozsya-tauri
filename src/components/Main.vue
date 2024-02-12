<script setup lang="ts">
import { usePathStore } from "../stores/path";
import { computed, ref } from "vue";
import Labels from "./Labels.vue";
import { stringifyPath, stringifySize } from "../utils";
import { openPath } from "../tauri";
import { GenDirEntry, ZswDirEntry } from "../types";

const DOUBLE_CLICK_INTERVAL = 500;
let doubleClickTimeoutId: number | undefined = undefined;

const pathStore = usePathStore();

const justClickedEntry = ref<string | null>(null);

function handleEntryDoubleClick(entry: GenDirEntry | ZswDirEntry) {
  const newPath = [...pathStore.path!, entry.file_name];
  const newPathStr = stringifyPath(newPath);
  if (entry.file_type === "Dir") {
    pathStore.goTo(newPathStr);
  } else {
    openPath(newPathStr);
  }
}

const handleClickEntry = (entry: GenDirEntry | ZswDirEntry) => {
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

const getEntryIcon = (entry: GenDirEntry | ZswDirEntry) => {
  if (entry.file_type === "Dir") {
    return "folder";
  }
  const ext = entry.file_name.split(".").pop()?.toLowerCase();
  if (ext === undefined) {
    return "draft";
  }
  if (["exe", "msi"].includes(ext)) {
    return "tabs";
  }
  if (["zip", "7z", "rar"].includes(ext)) {
    return "folder_zip";
  }
  if (["mp4", "mkv", "mov", "wmv"].includes(ext)) {
    return "movie";
  }
  if (["jpg", "jpeg", "png", "svg"].includes(ext)) {
    return "image";
  }
  if (["dll"].includes(ext)) {
    return "sdk";
  }
  if (["pdf"].includes(ext)) {
    return "book";
  }
  if (["lnk", "url"].includes(ext)) {
    return "link";
  }
  if (
    [
      "json",
      "yaml",
      "toml",
      "lock",
      "html",
      "vue",
      "ini",
      "tsx",
      "jsx",
      "css",
      "ron",
      "js",
      "ts",
      "rs",
    ].includes(ext)
  ) {
    return "code";
  }
  if (["mp3", "opus", "flac", "m4a"].includes(ext)) {
    return "music_note";
  }
  if (["txt", "md", "doc", "docx"].includes(ext)) {
    return "description";
  }
  return "draft";
};

const entries = computed(() => {
  if (pathStore.directory === null) return [];
  if (pathStore.directory.labels === undefined)
    return pathStore.directory.entries;
  return pathStore.directory.entries.filter((entry) =>
    pathStore.directory.filter!.every(
      (group) => entry.labels[group.index[0]][group.index[1]]
    )
  );
});
</script>

<template>
  <div class="root">
    <div v-if="pathStore.directory === null">Loading...</div>
    <div v-else class="list">
      <div
        v-for="entry in entries"
        :class="`entry ${pathStore.selected_entry === entry.file_name ? 'selected' : ''}`"
        @click="handleClickEntry(entry)"
        :title="entry.file_name"
      >
        <div class="line1">
          <span class="icon material-symbols-outlined">
            {{ getEntryIcon(entry) }}
          </span>
          <span class="name">{{ entry.file_name }}</span>
          <span
            class="size"
            v-text="stringifySize(entry.size)"
            v-if="entry.file_type === 'File'"
          ></span>
        </div>
        <div class="line2">
          <Labels :labels="entry.labels"></Labels>
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
