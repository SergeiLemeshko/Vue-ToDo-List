<template>
  <div 
    class="tooltip-wrapper" 
    @mouseenter="showTooltip" 
    @mouseleave="hideTooltip"
  >
    <span :class="{ 'truncated-text': shouldTruncate }">
      {{ displayText }}
    </span>
    <transition name="tooltip-fade">
      <div v-if="showTooltipWindow" class="tooltip">
        {{ props.text }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue';

export default defineComponent({
  name: 'TooltipText',
  props: {
    text: {
      type: String as PropType<string>,
      required: true,
    },
    isShort: {
      type: Boolean,
      default: false,
    },
    isShortCat: {
      type: Boolean,
      default: false,
    },
    isMedium: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // контролирует отображение всплывающего окна
    const showTooltipWindow = ref<boolean>(false);
    // определяет, нужно ли обрезать текст
    const shouldTruncate = computed(() => {
      if ((props.isShort || props.isShortCat || props.isMedium) && props.text.length >= 20) {
        return true;
      }
      return props.text.length >= 60;
    });

    // возвращающее либо полный текст, либо обрезанный с многоточием
    const displayText = computed(() => {
      if (shouldTruncate.value) {
        switch (true) {
          case props.isMedium:
            return `${props.text.slice(0, 48)}...`;
          case props.isShort:
            return `${props.text.slice(0, 29)}...`;
          case props.isShortCat:
            return `${props.text.slice(0, 20)}...`;
          default:
            return `${props.text.slice(0, 60)}...`;
        }
      }
      return props.text;
    });

    // показывает всплывающее окно
    const showTooltip = () => {
      if(shouldTruncate.value) showTooltipWindow.value = true;
    };

    // скрывает всплывающее окно
    const hideTooltip = () => {
      showTooltipWindow.value = false;
    };

    return {
      showTooltipWindow,
      shouldTruncate,
      displayText,
      props,
      showTooltip,
      hideTooltip,
    };
  },
});
</script>

<style scoped lang="scss">
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.truncated-text {
  cursor: pointer;
}

.tooltip {
  position: absolute;
  background-color: #333333d7;
  color: #d1c7c7;
  padding: 8px;
  border-radius: 4px;
  outline: 1px solid #3F72AF;
  outline-offset: -4px;
  font-size: 12px;
  z-index: 1;
  max-width: 300px;
  word-wrap: break-word;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.3s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>
