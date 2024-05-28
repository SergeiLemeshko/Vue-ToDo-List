<template>
  <section class="header">
    <h1 class="header-logo">ToDo List</h1>
    <nav class="header-nav">
      <router-link to="/todo" :class="{'active-link': currentBtn}">Задачи</router-link>
      <div class="header-divider"></div>
      <router-link to="/" :class="{'active-link': !currentBtn}">Категории</router-link>
    </nav>
    <div class="header-btns">
      <button-main v-if="currentBtn" :onClick="openMainModal">Добавить задачу</button-main>
      <button-main v-else :onClick="openMainModal">Добавить категорию</button-main>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useModalMainStore } from '../store/useModalMainStore';
import ButtonMain from '@/UI/ButtonMain.vue';

export default defineComponent({
  name: "HeaderSection",
  components: {
    ButtonMain,
  },
  setup() {
    const route = useRoute();
    const modalStore = useModalMainStore();
    const { isModalOpen } = storeToRefs(modalStore);

    // показываем модальное окно добавления задачи/категории
    const openMainModal = () => {
      modalStore.openMainModal(isModalOpen.value);
    }

    // для отображения кнопок добавить задачу/категорию
    const currentBtn = computed(() => route.path === "/todo");

    return { 
      currentBtn,
      isModalOpen,
      openMainModal,
    }
  },
});
</script>

<style scoped lang="scss">
.header {
  // position: fixed;
  display: flex;
  height: 88px;
  width: 100%;
  background-color: #3F72AF;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.19), 0 5px 6px rgba(0, 0, 0, 0.23);

  &-logo {
    font-size: 36px;
    font-weight: 400;
    display: flex;
    align-items: center;
    margin-left: 25px;
    color: #FFFFFF;
  }

  &-nav {
    display: flex;
    align-items: center;
    margin-left: 65px;
    font-size: 24px;
    font-weight: 400;
  }
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

/* состояние при переключении кнопок Задачи/Категории */
.active-link {
  color: #8FB6FF;
  position: relative;
  display: inline-block;
}

/* состояние линии подчеркивания при переключении кнопок Задачи/Категории */
.active-link::after {
  content: "";
  position: absolute;
  top: 25px;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background-color: #8FB6FF;
}

.header-btns {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 30px;
}
</style>