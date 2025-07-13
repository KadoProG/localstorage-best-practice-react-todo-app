export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type LocalStorageItem = {
  theme: 'light' | 'dark' | 'device';
  token: string | undefined;
  todos: TodoItem[];
};

const defaultLocalStorageItem: LocalStorageItem = {
  theme: 'device',
  token: undefined,
  todos: [],
};

export const LOCAL_STORAGE_KEY = 'localstorage-best-practice-react-todo-app-local-storage-key';

export const store = {
  get: <K extends keyof LocalStorageItem>(key: K): LocalStorageItem[K] => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!value) {
      return defaultLocalStorageItem[key];
    }

    try {
      const parsed: LocalStorageItem = JSON.parse(value);
      return parsed[key] || defaultLocalStorageItem[key];
    } catch {
      return defaultLocalStorageItem[key];
    }
  },

  set: <K extends keyof LocalStorageItem>(key: K, value: LocalStorageItem[K]) => {
    const current = localStorage.getItem(LOCAL_STORAGE_KEY);
    let parsed: LocalStorageItem = { ...defaultLocalStorageItem };

    if (current) {
      try {
        parsed = JSON.parse(current);
      } catch {
        // JSON parse error時はデフォルトを使う
      }
    }

    parsed[key] = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
  },

  remove: (key: keyof LocalStorageItem) => {
    const current = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!current) return;

    try {
      const parsed: LocalStorageItem = JSON.parse(current);
      delete parsed[key];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // エラー時は何もしない
    }
  },

  clear: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },

  // TODO専用のメソッド
  getTodos: (): TodoItem[] => {
    return store.get('todos');
  },

  addTodo: (text: string): TodoItem => {
    const todos = store.getTodos();
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
    const todos = store.getTodos();
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
    const todos = store.getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    if (filteredTodos.length === todos.length) return false;

    store.set('todos', filteredTodos);
    return true;
  },

  toggleTodo: (id: string): TodoItem | null => {
    const todos = store.getTodos();
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) return null;

    return store.updateTodo(id, { completed: !todo.completed });
  },

  clearCompleted: (): number => {
    const todos = store.getTodos();
    const activeTodos = todos.filter((todo) => !todo.completed);
    store.set('todos', activeTodos);
    return todos.length - activeTodos.length;
  },
};
