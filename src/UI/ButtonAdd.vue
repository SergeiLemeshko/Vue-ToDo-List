<template>
  <div class="btn-add" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ButtonAdd',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    // для обработки клика по кнопке
    const handleClick = () => {
      props.onClick();
    };

    return { handleClick }
  }
});
</script>

<style scoped lang="scss">
.btn-add {
  outline: none;
  border: 0;
  background: transparent;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 400;
  color: #FFFFFF;
  cursor: pointer;
}

.btn-add:hover {
  color: #8FB6FF;
  transition: all .3s;
}
</style>
