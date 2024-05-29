import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useBodyClass } from '@/composables/useBodyClass';

export const useModalMainStore = defineStore('modalMain', () => {
  const isModalOpen = ref<boolean>(false);
  const isEditModalOpen = ref<boolean>(false);

  // для открытия модального окна создания/редактирования
  function openMainModal(val: boolean): void {
    if(val === isModalOpen.value) {
      isModalOpen.value = true;
    } else isEditModalOpen.value = true;
  }

  // для закрытия модального окна создания/редактирования
  function closeMainModal(): void {
    isModalOpen.value = false;
    isEditModalOpen.value = false;
  } 

  // предотвращает возможность взаимодействия со списком под модальным окном
  useBodyClass(isModalOpen);

  return { isModalOpen, isEditModalOpen, openMainModal, closeMainModal };
});