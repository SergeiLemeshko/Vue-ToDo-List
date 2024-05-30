<template>
  <div @click="handleClick" class="btn-edit"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useModalMainStore } from '../store/useModalMainStore';
import { storeToRefs } from 'pinia';
import { useBodyClass } from '@/composables/useComposables';

export default defineComponent({
  name: 'ButtonEdit',
  props: {
    openMainModal: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    const modalStore = useModalMainStore();
    const { isEditModalOpen } = storeToRefs(modalStore);

    const handleClick = () => {
      props.openMainModal();
    };

    // предотвращает возможность взаимодействия со списком под модальным окном
    useBodyClass(isEditModalOpen);

    return { handleClick, isEditModalOpen }
  }
})
</script>

<style scoped lang="scss">
.btn-edit {
  background-image: url("../assets/editIcon.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 24px;
  height: 18px;
  cursor: pointer;
}
</style>