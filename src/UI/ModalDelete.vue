<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button @click="confirm">Да</button>
      <button @click="cancel">Нет</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ModalDelete',
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
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const visible = ref(false);

    const show = () => {
      visible.value = true;
    };

    const hide = () => {
      visible.value = false;
    };

    const confirm = () => {
      props.onConfirm();
      hide();
    };

    const cancel = () => {
      props.onCancel();
      hide();
    };

    return {
      visible,
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