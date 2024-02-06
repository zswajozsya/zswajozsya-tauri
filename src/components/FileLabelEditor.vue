<script setup lang="ts">
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";

import { usePathStore } from "../stores/path";
import { useDialogStore } from "../stores/dialog";
import { ref } from "vue";

const pathStore = usePathStore();
const dialogStore = useDialogStore();

const selectedLabel = ref<number | null>(null);
</script>

<template>
  <Dialog
    v-model:visible="dialogStore.isFileLabelEditorVisible"
    modal
    header="Label Editor"
    style="height: 200px; width: 400px"
    class="dialog"
    @hide="console.warn('TODO: save')"
  >
    <div class="dialog">
      <Dropdown
        v-model="pathStore.zswajozsya!.labels"
        option-label="name"
        placeholder="Select a label"
      />
      <MultiSelect
        v-if="selectedLabel === null"
        placeholder="Select options"
      />
      <MultiSelect
        v-else
        v-model="pathStore.zswajozsya!.labels[selectedLabel].options"
        option-label="name"
        placeholder="Select options"
      />
    </div>
  </Dialog>
</template>

<style scoped>
.dialog {
  display: flex;
  column-gap: 8px;
  .p-listbox {
    height: 280px;
    overflow: auto;
  }

  .labels,
  .options {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }
}
</style>
