<template>
  <div class="close-button" @click="handleClick"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ButtonClose',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const handleClick = () => {
      props.onClick();
    };

    return {
      handleClick,
    };
  },
});
</script>

<style scoped lang="scss">
.close-button {
  background-image: url("../assets/close-btn.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>
