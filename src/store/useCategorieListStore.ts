import { defineStore } from "pinia";
import { ref } from "vue";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const useCategorieListStore = defineStore("categorieList", () => {
  
    const BASE_URL = ref("http://localhost:8089/api/ToDoList");

    const fetchCategorie = async (path: string): Promise<Category[]> => {
      const response = await fetch(`${BASE_URL.value + path}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
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
    
    const deleteCategorie = async (categoryId: number,  path: string): Promise<void> => {
      const response = await fetch(`${BASE_URL.value + path}${categoryId}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    };

    return { BASE_URL, fetchCategorie, addCategorie, updateCategorie, deleteCategorie }
});