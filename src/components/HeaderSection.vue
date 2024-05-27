<template>
  <section class="header">
    <h1 class="header-logo">ToDo List</h1>
    <nav class="header-nav">
      <router-link to="/todo" :class="{'active-link': currentBtn}">Задачи</router-link>
      <div class="header-divider"></div>
      <router-link to="/" :class="{'active-link': !currentBtn}">Категории</router-link>
    </nav>
    <div class="header-btns">
      <button-add v-if="currentBtn" :onClick="openModal">Добавить задачу</button-add>
      <!-- openModal нужно будет поменять на ф-ю для категорий -->
      <button-add v-else :onClick="openModal">Добавить категорию</button-add>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import ButtonAdd from '@/UI/ButtonAdd.vue';
import { useModalTodoStore } from '../store/useModalTodoStore'

export default defineComponent({
  name: "HeaderSection",
  components: {
    ButtonAdd,
  },
  setup() {
    const route = useRoute();
    const modalStore = useModalTodoStore();
    const { isModalOpen } = storeToRefs(modalStore);

    const openModal = () => {
      modalStore.openModal(isModalOpen.value);
    }

    //для отображения кнопок Добавить задачу/Добавить категорию
    const currentBtn = computed(() => route.path === "/todo");

    return { 
      currentBtn,
      isModalOpen,
      openModal,
    }
  },
});
</script>

<style scoped lang="scss">
.header {
  display: flex;
  height: 88px;
  width: 100%;
  background-color: #3F72AF;
}

.header-logo {
  font-size: 36px;
  font-weight: 400;
  display: flex;
  align-items: center;
  margin-left: 25px;
  color: #FFFFFF;
}

.header-nav {
  display: flex;
  align-items: center;
  margin-left: 65px;
  font-size: 24px;
  font-weight: 400;
}

.header-divider {
  margin: 5px 9px 0px 9px;
  background-image: url("../assets/headerDivider.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 2px;
  height: 28px;
}

a { 
  text-decoration: none;
  font-size: 24px;
  font-weight: 400;
  color: #DBE2EF;
}

.active-link {
  color: #8FB6FF;
}

.header-btns {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 30px;
}
</style>