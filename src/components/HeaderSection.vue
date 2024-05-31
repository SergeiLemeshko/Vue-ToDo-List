<template>
  <section class="header">
    <h1 class="header-logo">ToDo List</h1>
    <nav class="header-nav">
      <router-link to="/" :class="{'active-link': currentBtn, 'line': true}">Задачи</router-link>
      <div class="header-divider"></div>
      <router-link to="/categories" :class="{'active-link': !currentBtn, 'line': true}">Категории</router-link>
    </nav>
    <div class="header-btns">
      <button-add v-if="currentBtn" :onClick="openMainModal">Добавить задачу</button-add>
      <button-add v-else :onClick="openMainModal">Добавить категорию</button-add>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useModalMainStore } from '../store/useModalMainStore';
import ButtonAdd from '@/UI/ButtonAdd.vue';

export default defineComponent({
  name: "HeaderSection",
  components: {
    ButtonAdd,
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
    const currentBtn = computed(() => route.path !== "/categories");

    return { 
      currentBtn,
      isModalOpen,
      openMainModal,
    }
  },
});
</script>

<style lang="scss">
.header {
  position: sticky;
  top: 0;
  display: flex;
  height: 88px;
  width: 100%;
  z-index: 2;
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

a:hover {
	color: #FFFFFF;
  transition: all .3s;
}

/* состояние при переключении кнопок Задачи/Категории */
.active-link {
  color: #8FB6FF;
  position: relative;
  display: inline-block;
  transition: all .3s;
}

/* состояние линии подчеркивания при переключении кнопок Задачи/Категории */
.line {
  position: relative;
  text-decoration: none;
}

.line::after {
  content: '';
  position: absolute;
  top: 25px;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background-color: currentColor;
  bottom: -2px;
  left: 0;
}

.header-btns {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 30px;
}
</style>