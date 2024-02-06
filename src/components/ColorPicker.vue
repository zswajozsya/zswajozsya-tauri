<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  disabled: Boolean,
})
const model = defineModel<string>({ required: true })

const picker = ref<HTMLInputElement | null>(null);
</script>

<template>
  <div @click="picker!.click()" :style="`background-color: ${model ?? 'white'}`">
    <input :disabled="props.disabled" type="color" v-model="model" ref="picker" />
  </div>
</template>

<style scoped>
div {
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 36px;
  height: 36px;
  input {
    opacity: 0;
  }
}
</style>
