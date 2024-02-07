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
  const labelOptions = pathStore.zswajozsya!.labels[newState.index].options;
  let entryIndex = pathStore.zswajozsya!.files.findIndex(
    (entry) => entry.filename === pathStore.selected_entry
  );

  // Initialize entry if not exists
  if (entryIndex === -1) {
    pathStore.zswajozsya!.files.push({
      filename: pathStore.selected_entry!,
      labels: pathStore.zswajozsya!.labels.map((label) =>
        new Array(label.options.length).fill(false)
      ),
    });
    entryIndex = pathStore.zswajozsya!.files.length - 1;
  }

  const fileLabelOptions =
    pathStore.zswajozsya!.files[entryIndex].labels[newState.index];
  selectedOptions.value = labelOptions
    .map((labelOption, index) => ({
      name: labelOption.name,
      index: index,
    }))
    .filter((option) => fileLabelOptions[option.index]);
});

// Save options selection state when it changes.
watch(selectedOptions, async (newState) => {
  // `entryIndex` cannot be -1, because user is editing it, so it must exist.
  let entryIndex = pathStore.zswajozsya!.files.findIndex(
    (entry) => entry.filename === pathStore.selected_entry
  );
  let optionsLength =
    pathStore.zswajozsya!.files[entryIndex].labels[selectedLabel.value!.index]
      .length;

  // Generate new options
  let newOptions = new Array<boolean>(optionsLength).fill(false);
  for (let i = 0; i < newState.value.length; i += 1) {
    newOptions[newState.value[i].index] = true;
  }

  // Save new options
  pathStore.zswajozsya!.files[entryIndex].labels[selectedLabel.value!.index] =
    newOptions;
  const res = await setDir(pathStore.pathString!, pathStore.zswajozsya!);
  res.match(
    (_) => {},
    (err) =>
      message(err, {
        title: "Error when saving file label options change",
        type: "error",
      })
  );
});
</script>

<template>
  <Dialog
    v-model:visible="dialogStore.isFileLabelEditorVisible"
    modal
    :header="pathStore.selected_entry!"
    style="width: 400px"
    class="dialog"
    @hide="selectedLabel = null"
  >
    <div class="dialog">
      <Dropdown
        :options="pathStore
          .zswajozsya!
          .labels
          .map((label, i) => ({
            name: label.name,
            index: i
          }))"
        v-model="selectedLabel"
        option-label="name"
        placeholder="Select a label"
      />
      <MultiSelect v-if="selectedLabel === null" placeholder="Select options" disabled />
      <MultiSelect
        v-else
        :options="pathStore
          .zswajozsya!
          .labels[selectedLabel.index]
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
