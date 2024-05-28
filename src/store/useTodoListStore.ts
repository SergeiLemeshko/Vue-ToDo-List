import { defineStore } from "pinia";
import { ref } from "vue";

export interface Task {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName?: string;
}

export const useTodoListStore = defineStore("todoList", () => {
  
    const BASE_URL = ref<string>("http://localhost:8089/api/ToDoList");

    // получение задач
    const fetchTasks = async (path: string): Promise<Task[]> => {
      const response = await fetch(`${BASE_URL.value + path}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    };
    
    // добавление задач
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
    
    // обновление задач
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
    
    // удаление задач
    const deleteTask = async (taskId: number,  path: string): Promise<void> => {
      const response = await fetch(`${BASE_URL.value + path}${taskId}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    };

    return { BASE_URL, fetchTasks, addTask, updateTask, deleteTask }
});