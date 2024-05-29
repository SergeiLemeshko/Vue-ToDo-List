<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <ButtonClose :onClick="cancel"></ButtonClose>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <ButtonMain size="small" color="blue" :onClick="confirm">Да</ButtonMain>
      <ButtonMain size="small" color="white" :onClick="cancel">Нет</ButtonMain>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { useBodyClass } from '@/composables/useBodyClass';
import ButtonClose from '@/UI/ButtonClose.vue';
import ButtonMain from '@/UI/ButtonMain.vue';

export default defineComponent({
  name: 'ModalDelete',
  components: {
    ButtonClose,
    ButtonMain,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    onConfirm: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onCancel: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const isVisible = ref<boolean>(false);

    const show = (): void => {
      isVisible.value = true;
    };

    const hide = (): void => {
      isVisible.value = false;
    };

    const confirm = (): void => {
      props.onConfirm();
      hide();
    };

    const cancel = (): void => {
      props.onCancel();
      hide();
    };

    // предотвращает возможность взаимодействия со списком под модальным окном
    useBodyClass(isVisible);

    return {
      isVisible,
      show,
      hide,
      confirm,
      cancel,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>