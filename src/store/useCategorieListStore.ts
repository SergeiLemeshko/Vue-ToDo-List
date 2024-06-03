import { defineStore } from "pinia";
import { ref } from "vue";
import { Task } from "../store/useTodoListStore";

export interface Category {
  id: number | null;
  name: string;
  description: string;
}

export const useCategorieListStore = defineStore("categorieList", () => {
  
    const BASE_URL = ref<string>("http://localhost:8089/api/ToDoList");

    // получение категорий
    const fetchCategorie = async (path: string): Promise<Category[]> => {
      const response = await fetch(`${BASE_URL.value + path}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    // добавление категорий
    const addCategorie = async (newCategory: Omit<Category, 'id'>, path: string): Promise<Category> => {
      const response = await fetch(`${BASE_URL.value + path}`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    // обновление категорий
    const updateCategorie = async (updatedCategory: Category, path: string): Promise<Category> => {
      const response = await fetch(`${BASE_URL.value + path}`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCategory)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    // удаление категорий
    const deleteCategorie = async (categoryId: number,  path: string): Promise<void> => {
      const response = await fetch(`${BASE_URL.value + path}${categoryId}`, {
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

    return { BASE_URL, fetchCategorie, addCategorie, updateCategorie, deleteCategorie, displayCategories }
});