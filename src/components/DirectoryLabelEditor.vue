<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Listbox from "primevue/listbox";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import ColorPicker from "./ColorPicker.vue";

import { usePathStore } from "../stores/path";
import { useDialogStore } from "../stores/dialog";
import { ref, watch } from "vue";
import { setDir } from "../tauri";
import { message } from "@tauri-apps/api/dialog";

const pathStore = usePathStore();
const dialogStore = useDialogStore();

const selectedLabel = ref<{
  name: string;
  id: number;
} | null>(null);
const selectedOption = ref<{
  name: string;
  id: number;
} | null>(null);

watch(selectedLabel, () => {
  selectedOption.value = null;
});

const addLabel = () => {
  pathStore.zswajozsya!.labels.push({
    name: `New Label ${pathStore.zswajozsya!.labels.length + 1}`,
    desc: "",
    color: "#ffffff",
    options: [],
  });
};

const removeLabel = () => {
  const index = selectedLabel.value!.id;
  selectedLabel.value = null;
  pathStore.zswajozsya!.labels.splice(index, 1);
  for (let i = 0; i < pathStore.zswajozsya!.files.length; i += 1) {
    pathStore.zswajozsya!.files[i].labels.splice(index, 1);
  }
};

const removeOption = () => {
  const labelIndex = selectedLabel.value!.id;
  const optionIndex = selectedOption.value!.id;
  selectedOption.value = null;
  pathStore.zswajozsya!.labels[labelIndex].options.splice(optionIndex, 1);
  for (let i = 0; i < pathStore.zswajozsya!.files.length; i += 1) {
    pathStore.zswajozsya!.files[i].labels[labelIndex].splice(optionIndex, 1);
  }
};

const addOption = () => {
  pathStore.zswajozsya!.labels[selectedLabel.value!.id].options.push({
    name: `New Option ${
      pathStore.zswajozsya!.labels[selectedLabel.value!.id].options.length + 1
    }`,
    desc: "",
  });
  for (let i = 0; i < pathStore.zswajozsya!.files.length; i += 1) {
    if (
      pathStore.zswajozsya!.files[i].labels[selectedLabel.value!.id] ===
      undefined
    ) {
      pathStore.zswajozsya!.files[i].labels[selectedLabel.value!.id] = [];
    } else {
      pathStore.zswajozsya!.files[i].labels[selectedLabel.value!.id].push(
        false
      );
    }
  }
};

const applyLabelChanges = async () => {
  const res = await setDir(pathStore.pathString!, pathStore.zswajozsya!);
  res.match(
    (_) => {},
    (err) =>
      message(err, {
        title: "Error when applying label changes",
        type: "error",
      })
  );
};
</script>

<template>
  <Dialog
    v-if="pathStore.path !== null"
    v-model:visible="dialogStore.isDirectoryLabelEditorVisible"
    modal
    :header="`📁 ${pathStore.path[pathStore.path.length - 1]}`"
    style="height: 433px; width: 664px"
    class="dialog"
    @hide="applyLabelChanges"
  >
    <div class="dialog">
      <div class="labels">
        <Listbox
          v-model="selectedLabel"
          :options="pathStore.zswajozsya!.labels.map((e, i) => ({ name: e.name, id: i }))"
          option-label="name"
          style="width: 200px"
        ></Listbox>
        <div class="buttons">
          <Button @click="addLabel">
            <span class="material-symbols-outlined">add</span>
          </Button>
          <Button :disabled="selectedLabel === null" @click="removeLabel">
            <span class="material-symbols-outlined">remove</span>
          </Button>
          <Button @click="console.warn('TODO')">
            <span class="material-symbols-outlined">arrow_upward</span>
          </Button>
          <Button @click="console.warn('TODO')">
            <span class="material-symbols-outlined">arrow_downward</span>
          </Button>
        </div>
      </div>
      <div class="options">
        <Listbox
          style="width: 200px"
          v-model="selectedOption"
          :options="selectedLabel !== null 
            ? pathStore.zswajozsya!.labels[selectedLabel.id].options.map((e, i) => ({ name: e.name, id: i })) 
            : undefined"
          option-label="name"
        ></Listbox>
        <div class="buttons">
          <Button :disabled="selectedLabel === null" @click="addOption">
            <span class="material-symbols-outlined">add</span>
          </Button>
          <Button
            :disabled="selectedLabel === null || selectedOption === null"
            @click="removeOption"
          >
            <span class="material-symbols-outlined">remove</span>
          </Button>
        </div>
      </div>
      <div class="form">
        <div class="inner">
          <label for="name">Name</label>
          <InputText
            id="name"
            v-if="selectedLabel !== null && selectedOption !== null"
            v-model="pathStore.zswajozsya!.labels[selectedLabel.id].options[selectedOption.id].name"
          />
          <InputText
            id="name"
            v-else-if="selectedLabel !== null"
            v-model="pathStore.zswajozsya!.labels[selectedLabel.id].name"
          />
          <InputText id="name" v-else disabled />
          <label for="description" style="margin-top: 8px">Description</label>
          <Textarea
            id="description"
            v-if="selectedLabel !== null && selectedOption !== null"
            v-model="pathStore.zswajozsya!.labels[selectedLabel.id].options[selectedOption.id].desc"
          ></Textarea>
          <Textarea
            id="description"
            v-else-if="selectedLabel !== null"
            v-model="pathStore.zswajozsya!.labels[selectedLabel.id].desc"
          ></Textarea>
          <Textarea id="description" v-else disabled></Textarea>
        </div>
        <div class="buttons">
          <ColorPicker
            v-if="selectedOption === null && selectedLabel !== null"
            v-model="(pathStore.zswajozsya!.labels[selectedLabel.id].color as string)"
            class="color_picker"
          />
        </div>
      </div>
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
  .options,
  .form {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    .buttons {
      display: flex;
      column-gap: 8px;
      justify-content: center;
      button {
        display: flex;
        justify-content: center;
        width: 36px;
        height: 36px;
      }
    }
  }

  .form {
    .inner {
      display: flex;
      flex-direction: column;
      width: 200px;
      row-gap: 4px;

      textarea {
        resize: none;
        height: 182px;
      }
    }
    .color_picker {
      input {
        width: 36px;
      }
    }
  }
}
</style>
