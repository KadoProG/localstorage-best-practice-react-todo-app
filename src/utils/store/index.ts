import type { TodoItem } from '../todoService/types';

type LocalStorageItem = {
  theme: 'light' | 'dark' | 'device';
  todos: TodoItem[];
};

const defaultLocalStorageItem: LocalStorageItem = {
  theme: 'device',
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
};
