import { defineStore } from 'pinia';
import { ref } from 'vue';

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

  return { isModalOpen, isEditModalOpen, openMainModal, closeMainModal };
});