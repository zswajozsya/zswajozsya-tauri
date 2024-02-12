<script setup lang="ts">
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";

import { usePathStore } from "../stores/path";
import { useDialogStore } from "../stores/dialog";
import { reactive, ref, watch } from "vue";
import { setDir } from "../tauri";
import { message } from "@tauri-apps/api/dialog";

const pathStore = usePathStore();
const dialogStore = useDialogStore();

const selectedLabel = ref<{
  name: string;
  index: number;
} | null>(null);
const selectedOptions = reactive<{
  value: { name: string; index: number }[];
}>({
  value: [],
});

// Update options when selected label changes
watch(selectedLabel, (newState) => {
  if (newState === null) return;

  const selectedEntry = pathStore.directory!.entries.find(
    (entry) => entry.file_name === pathStore.selected_entry
  )!;

  selectedOptions.value = pathStore
    .directory!.labels![newState.index].options.map((labelOption, index) => ({
      name: labelOption.name,
      index: index,
    }))
    .filter((option) => selectedEntry.labels![newState.index][option.index]);
});

// Save options selection state when it changes.
watch(selectedOptions, async (newState) => {
  const selectedEntryIndex = pathStore.directory!.entries.findIndex(
    (entry) => entry.file_name === pathStore.selected_entry
  )!;

  pathStore.directory!.entries[selectedEntryIndex].labels![
    selectedLabel.value!.index
  ] = convertOptions(newState.value);

  const res = await setDir(pathStore.pathString!, {
    entries: pathStore.directory!.entries.map((entry) => ({
      name: entry.file_name,
      labels: entry.labels!,
    })),
    labels: pathStore.directory!.labels!,
  });
  res.match(
    (_) => {},
    (err) =>
      message(err, {
        title: "Error when saving file label options change",
        type: "error",
      })
  );
});

/** Convert the options stored in `MultiSelect` component to the `boolean[]` form */
function convertOptions(
  value: {
    name: string;
    index: number;
  }[]
): boolean[] {
  const selectedEntryIndex = pathStore.directory!.entries.findIndex(
    (entry) => entry.file_name === pathStore.selected_entry
  );
  let optionsLength =
    pathStore.directory!.entries[selectedEntryIndex].labels![
      selectedLabel.value!.index
    ].length;

  // Generate new options
  let newOptions = new Array<boolean>(optionsLength).fill(false);
  for (let i = 0; i < value.length; i += 1) {
    newOptions[value[i].index] = true;
  }

  return newOptions;
}
</script>

<template>
  <Dialog
    v-if="pathStore.selected_entry !== null"
    v-model:visible="dialogStore.isFileLabelEditorVisible"
    modal
    :header="pathStore.selected_entry"
    style="width: 400px"
    class="dialog"
    @hide="selectedLabel = null"
  >
    <div class="dialog">
      <Dropdown
        :options="pathStore
          .directory!
          .labels!
          .map((label, i) => ({
            name: label.name,
            index: i
          }))"
        v-model="selectedLabel"
        option-label="name"
        placeholder="Select a label"
      />
      <MultiSelect
        v-if="selectedLabel === null"
        placeholder="Select options"
        disabled
      />
      <MultiSelect
        v-else
        :options="pathStore
          .directory!
          .labels![selectedLabel.index]
          .options
          .map((option, i) => ({
            name: option.name,
            index: i,
          }))"
        option-label="name"
        v-model="selectedOptions.value"
        placeholder="Select options"
        filter
      />
    </div>
  </Dialog>
</template>

<style scoped>
.dialog {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
</style>
