<script setup lang="ts">
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";

import { usePathStore } from "../stores";
import { useDialogStore } from "../stores/dialog";
import { initDir } from "../tauri";
import DirectoryLabelEditor from "./DirectoryLabelEditor.vue";

const pathStore = usePathStore();
const dialogStore = useDialogStore();
</script>

<template>
  <Toolbar class="toolbar">
    <template #start>
      <div class="start">
        <Button
          :text="pathStore.zswajozsya !== null"
          aria-label="Initialize Directory"
          title="Initialize Directory"
          :disabled="pathStore.zswajozsya !== null"
          @click="initDir(pathStore.pathString!)"
        >
          <span class="material-symbols-outlined">enable</span>
        </Button>
        <Button
          text
          :disabled="pathStore.zswajozsya === null"
          @click="dialogStore.isDirectoryLabelEditorVisible = true"
        >
          <span class="material-symbols-outlined">edit_note</span>
        </Button>
      </div>
    </template>
  </Toolbar>

  <DirectoryLabelEditor />
</template>

<style scoped>
.toolbar {
  padding: 0 6px;

  .start {
    display: flex;
    column-gap: 8px;
  }
  button {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
  }
}
</style>
