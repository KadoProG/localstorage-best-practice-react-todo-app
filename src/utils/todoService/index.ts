import { store } from '../store';
import type { TodoItem } from './types';

export const todoService = {
  getTodos: (): TodoItem[] => store.get('todos'),

  addTodo: (text: string): TodoItem => {
    const todos = todoService.getTodos();
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, newTodo];
    store.set('todos', updatedTodos);
    return newTodo;
  },

  updateTodo: (
    id: string,
    updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>
  ): TodoItem | null => {
    const todos = todoService.getTodos();
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) return null;

    const updatedTodo: TodoItem = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos];
    updatedTodos[todoIndex] = updatedTodo;
    store.set('todos', updatedTodos);
    return updatedTodo;
  },

  deleteTodo: (id: string): boolean => {
    const todos = todoService.getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    if (filteredTodos.length === todos.length) return false;

    store.set('todos', filteredTodos);
    return true;
  },

  toggleTodo: (id: string): TodoItem | null => {
    const todos = todoService.getTodos();
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) return null;

    return todoService.updateTodo(id, { completed: !todo.completed });
  },

  clearCompleted: (): number => {
    const todos = todoService.getTodos();
    const activeTodos = todos.filter((todo) => !todo.completed);
    store.set('todos', activeTodos);
    return todos.length - activeTodos.length;
  },
};
