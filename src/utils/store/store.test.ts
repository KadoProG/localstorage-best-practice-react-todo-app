import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LOCAL_STORAGE_KEY, store } from '.';

// テスト用の共通データ
const testTodo = {
  id: '1',
  text: 'test-todo',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// localStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('取得(get)', () => {
    it('localStorageが空の場合、デフォルト値を返すこと', () => {
      localStorageMock.getItem.mockReturnValue(null);

      // localStorageが空の場合、デフォルト値を返す
      expect(store.get('theme')).toBe('device');
      expect(store.get('todos')).toEqual([]);
    });

    it('localStorageに有効なデータがある場合、その値を返すこと', () => {
      const mockData = {
        theme: 'dark' as const,
        todos: [testTodo],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      // localStorageに有効なデータがある場合、その値を返す
      expect(store.get('theme')).toBe('dark');
      expect(store.get('todos')).toEqual([testTodo]);
    });

    it('localStorageの値が不正なJSONの場合、デフォルト値を返すこと', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      // localStorageの値が不正なJSONの場合、デフォルト値を返す
      expect(store.get('theme')).toBe('device');
      expect(store.get('todos')).toEqual([]);
    });

    it('データの一部キーが欠損している場合、欠損分はデフォルト値を返すこと[1]', () => {
      const mockData = {
        todos: [testTodo],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      // データの一部キーが欠損している場合、欠損分はデフォルト値を返す
      expect(store.get('theme')).toBe('device');
      expect(store.get('todos')).toEqual([testTodo]);
    });

    it('データの一部キーが欠損している場合、欠損分はデフォルト値を返すこと[2]', () => {
      const mockData = {
        theme: 'dark' as const,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      // データの一部キーが欠損している場合、欠損分はデフォルト値を返す
      expect(store.get('theme')).toBe('dark');
      expect(store.get('todos')).toEqual([]);
    });
  });

  describe('セット(set)', () => {
    it('localStorageが空の場合、新しい値をセットすること', () => {
      localStorageMock.getItem.mockReturnValue(null);

      // localStorageが空の場合、新しい値をセットする
      store.set('theme', 'dark');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
          todos: [],
        })
      );
    });

    it('localStorageに既存データがある場合、値を更新すること', () => {
      const existingData = {
        theme: 'light' as const,
        todos: [testTodo],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));

      // localStorageに既存データがある場合、値を更新する
      store.set('todos', [testTodo]);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'light',
          todos: [testTodo],
        })
      );
    });

    it('既存データが不正なJSONの場合、デフォルト値を使ってセットすること', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      // 既存データが不正なJSONの場合、デフォルト値を使ってセットする
      store.set('theme', 'dark');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
          todos: [],
        })
      );
    });

    it('themeの値をセットできること', () => {
      localStorageMock.getItem.mockReturnValue(null);

      // themeの値をセットできること
      store.set('theme', 'light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'light',
          todos: [],
        })
      );

      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
          todos: [],
        })
      );

      store.set('theme', 'device');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'device',
          todos: [],
        })
      );
    });

    it('todosの値をセットできること', () => {
      localStorageMock.getItem.mockReturnValue(null);
      // todosの値をセットできること
      store.set('todos', [testTodo]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'device',
          todos: [testTodo],
        })
      );

      store.set('todos', []);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'device',
          todos: [],
        })
      );
    });
  });

  describe('削除(remove)', () => {
    it('localStorageが空の場合、何もしないこと', () => {
      localStorageMock.getItem.mockReturnValue(null);

      // localStorageが空の場合、何もしない
      store.remove('theme');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('既存データから指定したキーを削除すること', () => {
      const existingData = {
        theme: 'dark' as const,
        todos: [testTodo],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));

      // 既存データから指定したキーを削除する
      store.remove('todos');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
        })
      );
    });

    it('既存データが不正なJSONの場合、何もしないこと', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      // 既存データが不正なJSONの場合、何もしない
      store.remove('theme');

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('themeキーを削除できること', () => {
      const existingData = {
        theme: 'light' as const,
        todos: [testTodo],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));

      // themeキーを削除できること
      store.remove('theme');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          todos: [testTodo],
        })
      );
    });
  });

  describe('クリア(clear)', () => {
    it('localStorageの全データを削除すること', () => {
      // localStorageの全データを削除する
      store.clear();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
    });
  });

  describe('統合テスト(integration)', () => {
    it('get/setの操作でデータの一貫性を維持すること', () => {
      // 初期状態
      localStorageMock.getItem.mockReturnValue(null);
      expect(store.get('theme')).toBe('device');
      expect(store.get('todos')).toEqual([]);

      // themeをセット
      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
          todos: [],
        })
      );

      // データが保存されたと仮定
      const storedData = {
        theme: 'dark' as const,
        todos: [],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));

      // 保存された値が取得できること
      expect(store.get('theme')).toBe('dark');
      expect(store.get('todos')).toEqual([]);

      // todosをセット
      store.set('todos', [testTodo]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
          todos: [testTodo],
        })
      );

      // 更新後のデータが取得できること
      const updatedData = {
        theme: 'dark' as const,
        todos: [testTodo],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(updatedData));

      expect(store.get('theme')).toBe('dark');
      expect(store.get('todos')).toEqual([testTodo]);
    });

    it('エラー復旧を優雅に処理すること', () => {
      // このテスト専用にモックをリセット
      vi.clearAllMocks();

      // 不正なデータから開始
      localStorageMock.getItem.mockReturnValue('invalid-json');

      // デフォルト値が返ること
      expect(store.get('theme')).toBe('device');
      expect(store.get('todos')).toEqual([]);

      // setで不正データを上書きできること
      store.set('theme', 'light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'light',
          todos: [],
        })
      );

      // set後に有効なデータが保存されたと仮定
      const validData = {
        theme: 'light' as const,
        todos: [],
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(validData));
      // 有効なデータが取得できること
      expect(store.get('theme')).toBe('light');
      expect(store.get('todos')).toEqual([]);
    });
  });
});
