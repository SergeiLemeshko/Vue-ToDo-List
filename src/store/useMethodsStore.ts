import { defineStore } from "pinia";
import { ref } from "vue";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
}

export const useMethodsStore = defineStore("methodsList", () => {
  
  const BASE_URL = ref<string>("http://localhost:8089/api/ToDoList");

  // получение категорий или задач
  const fetchData = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${BASE_URL.value + path}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };
  
  // добавление категорий или задач
  const addElem = async <T extends { id: number; name: string; description: string }>(//-----------------
    newEntity: Omit<T, 'id'>,
    path: string
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL.value + path}`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntity)
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };
  
  // обновление категорий или задач
  const updateElem = async <T>(updatedResource: T, path: string): Promise<T> => {
    const response = await fetch(`${BASE_URL.value + path}`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedResource)
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  };
  
  // удаление категорий или задач
  const deleteElem = async <T extends { id: number }>(id: T['id'], path: string): Promise<void> => {
    const response = await fetch(`${BASE_URL.value + path}${id}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  };
  
  // отображает на странице задач категории, привязанные к каждой задаче
  const displayCategories = (todos: Task[], categories: Category[]): void => {
    todos.forEach(todo => {
      const category = categories.find(c => c.id === todo.categoryId);
      if (category) {
        todo.categoryName = category.name;
        todos.sort((a, b) => a.id - b.id);
      } else todo.categoryName = '';
    });
  };

  return { BASE_URL, fetchData, addElem, updateElem, deleteElem, displayCategories }
});