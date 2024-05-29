import { watch, Ref } from 'vue';

// watcher, который предотвращает возможность взаимодействия со списком под модальным окном
export function useBodyClass(visible: Ref<boolean>) {
  watch(visible, (newVal) => {
    if (newVal) {
      document.body.classList.add('no-overflow');
    } else {
      document.body.classList.remove('no-overflow');
    }
  });
}
