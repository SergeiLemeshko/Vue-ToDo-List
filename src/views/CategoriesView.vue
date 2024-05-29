<template>
  <div class="categories">
    <CategoriesList/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CategoriesList from "@/components/CategoriesList.vue";

export default defineComponent({
  name: "CategoriesView",
  components: {
    CategoriesList,
  },
});
</script>

<style scooped lang="scss">
.categories {
  position: relative;
  flex-grow: 1;
}
</style>
