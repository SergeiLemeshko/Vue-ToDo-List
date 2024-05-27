import { defineStore } from "pinia";
import { ref } from "vue";

export interface Task {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const useTodoListStore = defineStore("todoList", () => {
  
    const BASE_URL = ref("http://localhost:8089/api/ToDoList");

    const fetchTasks = async (path: string): Promise<Task[]> => {
      const response = await fetch(`${BASE_URL.value + path}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    const addTask = async (newTask: Omit<Task, 'id'>, path: string): Promise<Task> => {
      const response = await fetch(`${BASE_URL.value + path}`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    const updateTask = async (updatedTask: Task, path: string): Promise<Task> => {
      const response = await fetch(`${BASE_URL.value + path}`, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    const deleteTask = async (taskId: number,  path: string): Promise<void> => {
      const response = await fetch(`${BASE_URL.value + path}${taskId}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    };

    // перенести в useCategorieListStore
    const displayCategories = (todos: Task[], categories: Category[]): void => {
      todos.forEach(todo => {
        const category = categories.find(c => c.id === todo.categoryId);
        if (category) {
          todo.categoryName = category.name;
          todos.sort((a, b) => a.id - b.id);
        } else todo.categoryName = '';
      });
    };

    return { BASE_URL, fetchTasks, addTask, updateTask, deleteTask, displayCategories }
});