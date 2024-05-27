import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalTodoStore = defineStore('modalTodo', () => {
  const isModalOpen = ref(false);
  const isEditModal = ref(false);

  
  function openModal(val: boolean) {
    if(val === isModalOpen.value) {
      isModalOpen.value = true;
    } else isEditModal.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    isEditModal.value = false;
  } 

  return { isModalOpen, isEditModal, openModal, closeModal };
});