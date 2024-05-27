<template>
  <div>
    <ul>
      <li v-for="cat in categories" :key="cat.id">
        {{ cat.title }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useTodoListStore } from "../store/useTodoListStore";

export default defineComponent({
  name: "CategoriesList",
  setup() {
    const store = useTodoListStore();

    interface Categorie {
      id: number;
      name: string;
      description: string;
    }

    const categories = ref<Categorie[]>([]);


    return { categories };
  },
});
</script>

<style lang="scss">

</style>
