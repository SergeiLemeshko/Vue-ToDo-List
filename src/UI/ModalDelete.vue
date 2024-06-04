<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-content__header">
        <h3>{{ title }}</h3>
        <ButtonClose :onClick="cancel"></ButtonClose>
      </div>
      <div class="question">
        <TooltipText :text="message" :isMedium="true">
          <p>{{ message }}</p>
        </TooltipText>
      </div>
      <div class="modal-content__buttons">
        <ButtonMain size="small" color="blue" :onClick="confirm">Да</ButtonMain>
        <ButtonMain size="small" color="white" :onClick="cancel">Нет</ButtonMain>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { useBodyClass } from '@/composables/useComposables';
import ButtonClose from '@/UI/ButtonClose.vue';
import ButtonMain from '@/UI/ButtonMain.vue';
import TooltipText from '@/UI/TooltipText.vue';

export default defineComponent({
  name: 'ModalDelete',
  components: {
    ButtonClose,
    ButtonMain,
    TooltipText,
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

<style scoped lang="scss">
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
  z-index: 3;
}

.modal-content {
  width: 600px;
  height: 238px;
  background: #DBE2EF;
  border-radius: 4px;
}

.modal-content__header {
  display: flex;
  justify-content: space-between;
  margin: 8px 0px 39px 0px;

  & h3 {
    font-size: 40px;
    font-weight: 500;
    color: #3F72AF;
  }
}

.question {
  font-size: 20px;
  text-align: left;
  letter-spacing: normal;
  letter-spacing: -1.1px;
}

.modal-content__buttons {
  display: flex;
  margin: 25px 0px 0px 0px;
  justify-content: end;
}
</style>