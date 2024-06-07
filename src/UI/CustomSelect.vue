<template>
  <div 
    class="custom-select" 
    ref="selectRef" 
    @click="toggleOpen" 
  >
    <div class="selected-value">
      <TooltipText :text="selectedCategory ? selectedCategory.name : 'Выберите категорию'" :isShortCat="true" />
    </div>
    <div v-if="isOpenSelect" class="options">
      <div 
        class="option" 
        v-for="(category, index) in categoriesWithDefault" 
        :key="index"
        :class="{ 'selected': category.id === selectedValue }" 
        @click="selectCategory(category)"
      >
        <TooltipText :text="category.name" :isShortCat="true">
          <span>{{ category.name }}</span>
        </TooltipText>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, onMounted, onBeforeUnmount } from 'vue';
import { Category } from "../store/useMethodsStore";
import { useSelectClass } from '@/composables/useComposables';
import TooltipText from '@/UI/TooltipText.vue';

export default defineComponent({
  name: 'CustomSelect',
  components: {
    TooltipText,
  },
  props: {
    modelValue: {
      type: [Number, null] as PropType<number | null>,
      required: true,
    },
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // открытие/закрытие выпадающего списка
    const isOpenSelect = ref<boolean>(false); 
    // cсылка на DOM-элемент выпадающего списка
    const selectRef = ref<HTMLDivElement | null>(null);

    // хранит выбранное значение выпадающего списка
    const selectedValue = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    // переключает состояние открытие/закрытие и меняет стрелку
    const toggleOpen = () => {
      if (!isOpenSelect.value) {
        selectRef.value?.classList.add('open');
      } else {
        selectRef.value?.classList.remove('open');
      }
      isOpenSelect.value = !isOpenSelect.value;
    };

    // выбирает категорию из списка
    const selectCategory = (category: Category) => {
      if (typeof category.id === 'number') {
        selectedValue.value = category.id;
      } else {
        selectedValue.value = null;
      }
      isOpenSelect.value = false;
    };

    // для получения выбранной категории
    const selectedCategory = computed(() => {
      const selectedCat = categoriesWithDefault.value.find(category => {
        return typeof category.id === 'number' && category.id === props.modelValue;
      });
      return selectedCat || null;
    });

    // закрывает выпадающий список, если клик произошел за его пределами
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpenSelect.value = false;
        selectRef.value?.classList.remove('open');
      }
    };

    // добавляет "Выберите категорию" в начало списка категорий
    const categoriesWithDefault = computed(() => [
      { id: -1, name: 'Выберите категорию', description: '' },
      ...props.categories
    ]);

    // Добавляет обработчик клика на весь документ для закрытия выпадающего списка
    onMounted(() => {
      document.body.addEventListener('click', handleClickOutside);
    });

    // Удаляет обработчик клика на весь документ при размонтировании компонента
    onBeforeUnmount(() => {
      document.body.removeEventListener('click', handleClickOutside);
    });

    useSelectClass(isOpenSelect, selectRef);

    return {
      isOpenSelect,
      selectRef,
      selectedValue,
      selectedCategory,
      categoriesWithDefault,
      toggleOpen,
      selectCategory,
    };
  }
});
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  border: 2px solid #3F72AF;
  border-radius: 4px;
  width: 346px;
  padding: 9px 10px;
  height: 46px;
  font-size: 20px;
  background-color: #DBE2EF;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('../assets/arrow.svg');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  outline: none;
}

.custom-select::-ms-expand {
  display: none;
}

.custom-select.open {
  background-image: url('../assets/arrow-open.svg') !important;
}

.custom-select:hover {
  border: 2px solid #257FEA;
  background-image: url('../assets/arrow-hover.svg');
}

.custom-select:focus {
  border: 2px solid #257FEA;
}

.selected-value {
  text-align: left;
}

.selected-value:hover {
  color: #00000085;
  transition: all .2s;
}

.options {
  position: absolute;
  top: 100%;
  left: -2px;
  min-width: 346px;
  height: 400px;
  border: 2px solid #257FEA;
  border-radius: 4px;
  margin-top: 5px;
  background-color: #DBE2EF;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.option {
  text-align: left;
  padding: 10px;
  cursor: pointer;
}

.option:hover {
  background-color: #8cb6ebdc;
  color: #000;
  transition: all .3s;
}

.option.selected {
  background-color: #3F72AF;
  color: #fff;
}
</style>
