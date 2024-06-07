<template>
  <div class="spinner-container" v-if="isLoading">
    <div class="spinner">
      <div 
        v-for="n in pointsCount" 
        :key="n" 
        class="point" 
        :style="pointStyle()"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SpinnerLoad',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const pointsCount = ref<number>(9); // Количество точек

    type PointStyle = {
      animationDelay: string;
      animationDuration: string;
    };

    const pointStyle = (): PointStyle => {
      const delay = `${Math.random() * 0.6}s`; // случайная задержка
      const duration = `${0.5 + Math.random() * 0.6}s`; // случайная продолжительность

      return {
        animationDelay: delay,
        animationDuration: duration
      };
    };
    
    return { pointsCount, pointStyle };
  }
});
</script>

<style scoped lang="scss">
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #DBE2EF;
}

.spinner {
  display: flex;
  gap: 5px;
  margin-top: -15px;
}

.point {
  width: 10px;
  height: 10px;
  background-color: #3F72AF;
  border-radius: 50%;
  animation: bounce 1s infinite alternate;
}

.point:nth-child(3) {
  margin-right: 17px;
}

.point:nth-child(6) {
  margin-right: 20px;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}
</style>
