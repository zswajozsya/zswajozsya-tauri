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
  pathStore.directory!.labels!.push({
    name: `New Label ${pathStore.directory!.labels!.length + 1}`,
    desc: "",
    color: "#ffffff",
    options: [],
  });
  for (let i = 0; i < pathStore.directory!.entries.length; i += 1) {
    pathStore.directory!.entries[i].labels!.push([]);
  }
};

const removeLabel = () => {
  const index = selectedLabel.value!.id;
  selectedLabel.value = null;
  pathStore.directory!.labels!.splice(index, 1);
  for (let i = 0; i < pathStore.directory!.entries.length; i += 1) {
    pathStore.directory!.entries[i].labels!.splice(index, 1);
  }
};

const moveUpLabel = () => {
  const index = selectedLabel.value!.id;

  selectedLabel.value!.id -= 1;

  const temp = pathStore.directory!.labels![index];
  pathStore.directory!.labels![index] = pathStore.directory!.labels![index - 1];
  pathStore.directory!.labels![index - 1] = temp;

  for (let i = 0; i < pathStore.directory!.entries.length; i += 1) {
    const temp = pathStore.directory!.entries[i].labels![index];
    pathStore.directory!.entries[i].labels![index] =
      pathStore.directory!.entries[i].labels![index - 1];
    pathStore.directory!.entries[i].labels![index - 1] = temp;
  }
};

const moveDownLabel = () => {
  const index = selectedLabel.value!.id;

  selectedLabel.value!.id += 1;

  const temp = pathStore.directory!.labels![index];
  pathStore.directory!.labels![index] = pathStore.directory!.labels![index + 1];
  pathStore.directory!.labels![index + 1] = temp;

  for (let i = 0; i < pathStore.directory!.entries.length; i += 1) {
    const temp = pathStore.directory!.entries[i].labels![index];
    pathStore.directory!.entries[i].labels![index] =
      pathStore.directory!.entries[i].labels![index + 1];
    pathStore.directory!.entries[i].labels![index + 1] = temp;
  }
};

const removeOption = () => {
  const labelIndex = selectedLabel.value!.id;
  const optionIndex = selectedOption.value!.id;
  selectedOption.value = null;
  pathStore.directory!.labels![labelIndex].options.splice(optionIndex, 1);
  for (let i = 0; i < pathStore.directory!.entries.length; i += 1) {
    pathStore.directory!.entries[i].labels![labelIndex].splice(optionIndex, 1);
  }
};

const addOption = () => {
  const options = pathStore.directory!.labels![selectedLabel.value!.id].options;

  const newOptionId = options.length;
  const newOptionName = `New Option ${newOptionId + 1}`;
  options.push({
    name: newOptionName,
    desc: "",
  });

  for (let i = 0; i < pathStore.directory!.entries.length; i += 1) {
    const labels = pathStore.directory!.entries[i].labels!;
    if (labels[selectedLabel.value!.id] === undefined) {
      labels[selectedLabel.value!.id] = [];
    } else {
      labels[selectedLabel.value!.id].push(false);
    }
  }

  selectedOption.value = {
    name: newOptionName,
    id: newOptionId,
  };
};

const applyLabelChanges = async () => {
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
          :options="pathStore.directory!.labels!.map((e, i) => ({ name: e.name, id: i }))"
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
          <Button
            :disabled="selectedLabel === null || selectedLabel.id === 0"
            @click="moveUpLabel"
          >
            <span class="material-symbols-outlined">arrow_upward</span>
          </Button>
          <Button
            :disabled="selectedLabel === null || selectedLabel.id === pathStore.directory.labels!.length - 1"
            @click="moveDownLabel"
          >
            <span class="material-symbols-outlined">arrow_downward</span>
          </Button>
        </div>
      </div>
      <div class="options">
        <Listbox
          style="width: 200px"
          v-model="selectedOption"
          :options="selectedLabel !== null 
            ? pathStore.directory!.labels![selectedLabel.id].options.map((e, i) => ({ name: e.name, id: i })) 
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
            v-model="pathStore.directory!.labels![selectedLabel.id].options[selectedOption.id].name"
          />
          <InputText
            id="name"
            v-else-if="selectedLabel !== null"
            v-model="pathStore.directory!.labels![selectedLabel.id].name"
          />
          <InputText id="name" v-else disabled />
          <label for="description" style="margin-top: 8px">Description</label>
          <Textarea
            id="description"
            v-if="selectedLabel !== null && selectedOption !== null"
            v-model="pathStore.directory!.labels![selectedLabel.id].options[selectedOption.id].desc"
          ></Textarea>
          <Textarea
            id="description"
            v-else-if="selectedLabel !== null"
            v-model="pathStore.directory!.labels![selectedLabel.id].desc"
          ></Textarea>
          <Textarea id="description" v-else disabled></Textarea>
        </div>
        <div class="buttons">
          <ColorPicker
            v-if="selectedOption === null && selectedLabel !== null"
            v-model="(pathStore.directory!.labels![selectedLabel.id].color as string)"
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
