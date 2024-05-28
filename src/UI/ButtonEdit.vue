<template>
  <div @click="handleClick" class="btn-edit"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'EditIcon',
  props: {
    openMainModal: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    const handleClick = () => {
      props.openMainModal()
    }

    return { handleClick }
  }
})
</script>

<style scoped lang="scss">
.btn-edit {
  background-image: url("../assets/editIcon.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 24px;
  height: 18px;
  cursor: pointer;
}
</style>