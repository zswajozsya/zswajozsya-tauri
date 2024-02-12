<script setup lang="ts">
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Divider from "primevue/divider";
import MultiSelect from "primevue/multiselect";

import { usePathStore } from "../stores/path";
import { useDialogStore } from "../stores/dialog";
import { openPath, setDir } from "../tauri";
import DirectoryLabelEditor from "./DirectoryLabelEditor.vue";
import FileLabelEditor from "./FileLabelEditor.vue";
import { bestFontColor } from "../libs/miscs";

const pathStore = usePathStore();
const dialogStore = useDialogStore();
</script>

<template>
  <Toolbar class="toolbar">
    <template #start>
      <div class="group_1">
        <Button
          :text="pathStore.directory !== null"
          aria-label="Initialize Directory"
          title="Initialize Directory"
          :disabled="pathStore.directory !== null"
          @click="setDir(pathStore.pathString!, { entries: [], labels: [] })"
        >
          <span class="material-symbols-outlined">enable</span>
        </Button>
        <Button
          text
          :disabled="pathStore.directory === null"
          @click="dialogStore.isDirectoryLabelEditorVisible = true"
          title="Edit label configuration of this directory"
        >
          <span class="material-symbols-outlined">edit_note</span>
        </Button>
      </div>
      <Divider layout="vertical" />
      <div class="group_2">
        <Button
          text
          :disabled="pathStore.pathString === null"
          @click="openPath(pathStore.pathString!)"
          title="Open this directory in default application"
        >
          <span class="material-symbols-outlined">open_in_new</span>
        </Button>
      </div>
      <Divider layout="vertical" />
      <div class="group_3">
        <Button
          text
          :disabled="
            pathStore.directory === null || pathStore.selected_entry === null
          "
          @click="dialogStore.isFileLabelEditorVisible = true"
          title="Edit labels of the selected entry"
        >
          <span class="material-symbols-outlined">edit</span>
        </Button>
      </div>
    </template>
    <template #end>
      <MultiSelect
        :options="
          pathStore.directory.labels.map((label, i) => ({
            name: label.name,
            desc: label.desc,
            color: label.color,
            options: label.options.map((option, j) => ({
              name: option.name,
              desc: option.desc,
              index: [i, j],
            })),
          }))
        "
        optionLabel="name"
        optionGroupLabel="name"
        optionGroupChildren="options"
        filter
        placeholder="Filter"
        display="chip"
        v-model="pathStore.directory.filter"
        style="width: 240px;"
        v-if="pathStore.directory?.labels !== undefined"
      >
        <template #optiongroup="group">
          <span
            :style="{
              backgroundColor: group.option.color,
              color: bestFontColor(group.option.color) ? 'black' : 'white',
              padding: '4px 6px',
              borderRadius: '8px',
            }"
            v-text="group.option.name"
            :title="group.option.desc"
          ></span>
        </template>
        <template #option="option">
          <span v-text="option.option.name" :title="option.option.desc"></span>
        </template>
      </MultiSelect>
    </template>
  </Toolbar>

  <DirectoryLabelEditor />
  <FileLabelEditor />
</template>

<style scoped>
.toolbar {
  padding: 0 6px;

  .group_1 {
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
