<template>
  <li class="wrapper">
    <section v-if="isTodoPage" class="todo">
      <div class="todo-top">
        <p v-if="item.name" class="todo-top__name">{{ item.name }}</p>
        <div class="todo-top__container">
          <div v-if="item.categoryName" class="todo-top__folder"></div>
          <span v-if="item.categoryName">{{ item.categoryName }}</span>
        </div>
      </div>
      <p v-if="item.description" class="todo-description">{{ item.description }}</p>
    </section>
    <section v-if="!isTodoPage" class="categorie">
      <div class="categorie-container">
        <span v-if="item.name" class="categorie-container__name">{{ item.name }}</span>
        <span v-if="item.description" class="categorie-container__description">{{ item.description }}</span>
      </div>
    </section>
    <section class="todo-btns">
      <ButtonEdit :openMainModal="openMainModal" />
      <ButtonDelete :itemId="item.id" @remove="confirmRemoveItem" />
    </section>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ButtonDelete from '@/UI/ButtonDelete.vue';
import ButtonEdit from '@/UI/ButtonEdit.vue';

export default defineComponent({
  name: 'TodoItem',
  components: {
    ButtonDelete,
    ButtonEdit,
  },
  props: {
    item: {
      type: Object as PropType<{ id: number; name: string; description?: string; categoryName?: string }>,
      required: true,
    },
    confirmRemoveItem: {
      type: Function as PropType<(id: number) => void>,
      required: true,
    },
    openMainModal: {
      type: Function as PropType<() => void>,
      required: true,
    },
    isTodoPage: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  max-width: 1000px;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  margin: 0 auto;
  border-bottom: 2px solid #3F72AF;
}
.todo-top {
  display: flex;
  margin-bottom: 8px;

  &__container {
    display: flex;
    align-items: flex-start;
    justify-content: center;

    & span {
      font-size: 18px;
      line-height: 21px;
      color: #3F72AF;
      margin-left: 2px
    }
  }

  &__name {
    font-size: 18px;
    font-weight: 500;
    text-align: justify;
    max-width: 500px;
  }

  &__folder {
    background-image: url("../assets/folder.svg");
    background-repeat: no-repeat;
    background-size: contain;
    width: 24px;
    height: 18px;
    margin-left: 22px;
  }
}

.todo-description {
  display: flex;
  color: #808080;
  text-align: justify;
  max-width: 500px;
}

.todo-btns {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.categorie-container {
  display: flex;
  flex-direction: column;

  &__name {
    font-size: 18px;
    font-weight: 500;
    text-align: justify;
    max-width: 500px;
    margin-bottom: 8px;
  }

  &__description {
    display: flex;
    color: #808080;
    text-align: justify;
    max-width: 500px;
  }
}
</style>