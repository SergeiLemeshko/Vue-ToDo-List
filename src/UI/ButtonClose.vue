<template>
  <button class="close-button" @click="handleClick">✕</button>
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
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: blue;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.close-button:hover {
  color: darkblue;
}
</style>
