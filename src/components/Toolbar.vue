<script setup lang="ts">
import Toolbar from "primevue/toolbar";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Listbox from "primevue/listbox";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import ColorPicker from "./ColorPicker.vue";

import { usePathStore } from "../stores";
import { initDir } from "../tauri";
import { reactive, ref, watch } from "vue";
import { Label } from "../types";

const pathStore = usePathStore();
const isEditorVisible = ref(false);

const files = ref<
  | {
      filename: string;
      labels: boolean[][];
    }[]
  | null
>(null);

const labels = reactive<{ value: Label[] | null }>({ value: null });
const selectedLabel = ref<number | null>(null);
const selectedOption = ref<number| null>(null);

watch(pathStore, (newState) => {
  if (newState.zswajozsya === null) return;
  labels.value = newState.zswajozsya.labels;
  files.value = newState.zswajozsya.files;
});

watch(selectedLabel, () => {
  selectedOption.value = null;
});

const removeLabel = () => {
  const index = selectedLabel.value!;
  selectedLabel.value = null;
  labels.value!.splice(index, 1);
};

const removeOption = () => {
  const labelIndex = selectedLabel.value!;
  const optionIndex = selectedOption.value!;
  selectedOption.value = null;
  labels.value![labelIndex].options.splice(optionIndex, 1);
}
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
          @click="isEditorVisible = true"
        >
          <span class="material-symbols-outlined">edit_note</span>
        </Button>
      </div>
    </template>
  </Toolbar>

  <Dialog
    v-model:visible="isEditorVisible"
    modal
    header="Label Editor"
    style="height: 433px; width: 664px"
    class="dialog"
    @hide="console.warn('TODO: hide')"
  >
    <div class="dialog">
      <div class="labels">
        <Listbox
          v-model="selectedLabel"
          :options="labels.value!.map((e, i) => ({ name: e.name, id: i }))"
          option-label="name"
          style="width: 200px"
        ></Listbox>
        <div class="buttons">
          <Button
            @click="
              labels.value!.push({
                name: `New Label ${labels.value!.length + 1}`,
                desc: '',
                color: '#ffffff',
                options: [],
              })
            "
          >
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
            ? labels.value![selectedLabel].options.map((e, i) => ({ name: e.name, id: i })) 
            : undefined"
          option-label="name"
        ></Listbox>
        <div class="buttons">
          <Button
            :disabled="selectedLabel === null"
            @click="
              labels.value![selectedLabel!].options.push({
                name: `New Option ${
                  labels.value![selectedLabel!].options.length + 1
                }`,
                desc: '',
              })
            "
          >
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
            v-model="labels.value![selectedLabel].options[selectedOption].name"
          />
          <InputText
            id="name"
            v-else-if="selectedLabel !== null"
            v-model="labels.value![selectedLabel].name"
          />
          <InputText id="name" v-else disabled />
          <label for="description" style="margin-top: 8px">Description</label>
          <Textarea
            id="description"
            v-if="selectedLabel !== null && selectedOption !== null"
            v-model="labels.value![selectedLabel].options[selectedOption].desc"
          ></Textarea>
          <Textarea
            id="description"
            v-else-if="selectedLabel !== null"
            v-model="labels.value![selectedLabel].desc"
          ></Textarea>
          <Textarea id="description" v-else disabled></Textarea>
        </div>
        <div class="buttons">
          <ColorPicker
            v-if="selectedOption === null && selectedLabel !== null"
            v-model="(labels.value![selectedLabel].color as string)"
            class="color_picker"
          />
        </div>
      </div>
    </div>
  </Dialog>
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
