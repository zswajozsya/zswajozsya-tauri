<script setup lang="ts">
import { computed } from "vue";
import { usePathStore } from "../stores/path";
import { bestFontColor } from "../libs/miscs";

const props = defineProps<{
  labels?: boolean[][];
}>();

const pathStore = usePathStore();

const labels = computed(() => {
  if (props.labels === undefined) return [];
  if (pathStore.directory?.labels === undefined) return [];
  return pathStore.directory.labels
    .map((label, i) =>
      label.options.map((option, j) => ({
        name: option.name,
        desc: option.desc,
        color: label.color,
        selected: props.labels![i][j],
      }))
    )
    .flat()
    .filter((label) => label.selected)
    .map((label) => ({
      name: label.name,
      desc: label.desc,
      color: label.color,
    }));
});
</script>

<template>
  <main>
    <div
      v-for="label in labels"
      :title="label.desc"
      :style="`
        color: ${bestFontColor(label.color) ? 'black' : 'white'};
        background-color: ${label.color}`"
    >
      {{ label.name }}
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  column-gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  div {
    padding: 3.5px 5.6px;
    border-radius: 6px;
  }
}
</style>
