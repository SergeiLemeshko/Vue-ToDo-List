<template>
  <button 
    type="button" 
    :class="[buttonClass, colorClass]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

export default defineComponent({
  name: 'ButtonMain',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      required: false,
    },
    size: {
      type: String as PropType<'small' | 'medium'>,
      default: 'medium',
    },
    color: {
      type: String as PropType<'blue' | 'white' >,
      default: 'blue',
    },
  },
  setup(props) {
    const handleClick = () => {
      if (props.onClick) {
        props.onClick();
      }
    };

    const buttonClass = computed(() => {
      return {
        'btn-small': props.size === 'small',
        'btn-medium': props.size === 'medium',
      };
    });

    const colorClass = computed(() => {
      return {
        'btn-blue': props.color === 'blue',
        'btn-white': props.color === 'white',
      };
    });

    return {
      handleClick,
      buttonClass,
      colorClass,
    };
  },
});
</script>

<style scoped lang="scss">
  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-small {
    height: 46px;
    width: 120px;
    font-size: 18px;
    border: 2px solid #3F72AF;
    border-radius: 4px;
    margin-left: 24px;
  }

  .btn-medium {
    height: 46px;
    width: 200px;
    border-radius: 4px;
    font-size: 18px;
    letter-spacing: 0.6px;
  }

  .btn-blue {
    background-color: #3F72AF;
    color: #FFFFFF;
  }

  .btn-white {
    background-color: #DBE2EF;
    color: #3F72AF;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
