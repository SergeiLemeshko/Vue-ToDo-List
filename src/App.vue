<template>
  <HeaderSection/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderSection from "@/components/HeaderSection.vue";

export default defineComponent({
  name: "App",
  components: {
    HeaderSection,
  },
});
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

#app {
  text-align: center;
  font-family: Roboto;
}

body {
  background-color: #DBE2EF;
}
</style>
