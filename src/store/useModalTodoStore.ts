import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalTodoStore = defineStore('modalTodo', () => {
  const isModalOpen = ref(false);

  function openModal() {
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  } 

  return { isModalOpen, openModal, closeModal };
});