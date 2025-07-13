import { describe, it, expect, beforeEach, vi } from 'vitest';
import { todoService } from './index';
import { store } from '../store';
import type { TodoItem } from './types';

// storeのモック
vi.mock('../store', () => ({
  store: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

const mockStore = vi.mocked(store);

// テスト用の共通データ
const testTodo: TodoItem = {
  id: 'test-id-1',
  text: 'テスト用のTodo',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const testTodo2: TodoItem = {
  id: 'test-id-2',
  text: '完了済みのTodo',
  completed: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('todoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // crypto.randomUUIDのモック
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'mocked-uuid'),
    });
  });

  describe('getTodos', () => {
    it('保存されているTodoの配列を取得できること', () => {
      const mockTodos = [testTodo, testTodo2];
      mockStore.get.mockReturnValue(mockTodos);

      const result = todoService.getTodos();

      expect(mockStore.get).toHaveBeenCalledWith('todos');
      expect(result).toEqual(mockTodos);
    });

    it('Todoが存在しない場合、空配列を返すこと', () => {
      mockStore.get.mockReturnValue([]);

      const result = todoService.getTodos();

      expect(mockStore.get).toHaveBeenCalledWith('todos');
      expect(result).toEqual([]);
    });
  });

  describe('addTodo', () => {
    it('新しいTodoを追加できること', () => {
      const existingTodos = [testTodo];
      const newTodoText = '新しいTodo';

      mockStore.get.mockReturnValue(existingTodos);

      const result = todoService.addTodo(newTodoText);

      // 新しいTodoの構造を確認
      expect(result).toEqual({
        id: 'mocked-uuid',
        text: newTodoText,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      // store.setが正しく呼ばれることを確認
      expect(mockStore.set).toHaveBeenCalledWith('todos', [testTodo, result]);
    });

    it('空の配列に新しいTodoを追加できること', () => {
      mockStore.get.mockReturnValue([]);
      const newTodoText = '最初のTodo';

      const result = todoService.addTodo(newTodoText);

      expect(result).toEqual({
        id: 'mocked-uuid',
        text: newTodoText,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(mockStore.set).toHaveBeenCalledWith('todos', [result]);
    });

    it('作成日時と更新日時が現在時刻で設定されること', () => {
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate);

      mockStore.get.mockReturnValue([]);
      const result = todoService.addTodo('テストTodo');

      expect(result.createdAt).toBe(mockDate.toISOString());
      expect(result.updatedAt).toBe(mockDate.toISOString());

      vi.useRealTimers();
    });
  });

  describe('updateTodo', () => {
    it('指定したIDのTodoを更新できること', () => {
      const todos = [testTodo, testTodo2];
      mockStore.get.mockReturnValue(todos);

      const updates = {
        text: '更新されたテキスト',
        completed: true,
      };

      const result = todoService.updateTodo(testTodo.id, updates);

      expect(result).toEqual({
        ...testTodo,
        ...updates,
        updatedAt: expect.any(String),
      });

      expect(mockStore.set).toHaveBeenCalledWith('todos', [result, testTodo2]);
    });

    it('存在しないIDの場合はnullを返すこと', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.updateTodo('non-existent-id', {
        text: '更新されたテキスト',
      });

      expect(result).toBeNull();
      expect(mockStore.set).not.toHaveBeenCalled();
    });

    it('部分的な更新ができること', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.updateTodo(testTodo.id, {
        text: 'テキストのみ更新',
      });

      expect(result).toEqual({
        ...testTodo,
        text: 'テキストのみ更新',
        updatedAt: expect.any(String),
      });
    });

    it('completedのみの更新ができること', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.updateTodo(testTodo.id, {
        completed: true,
      });

      expect(result).toEqual({
        ...testTodo,
        completed: true,
        updatedAt: expect.any(String),
      });
    });

    it('更新日時が現在時刻で設定されること', () => {
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate);

      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.updateTodo(testTodo.id, {
        text: '更新されたテキスト',
      });

      expect(result?.updatedAt).toBe(mockDate.toISOString());

      vi.useRealTimers();
    });
  });

  describe('deleteTodo', () => {
    it('指定したIDのTodoを削除できること', () => {
      const todos = [testTodo, testTodo2];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.deleteTodo(testTodo.id);

      expect(result).toBe(true);
      expect(mockStore.set).toHaveBeenCalledWith('todos', [testTodo2]);
    });

    it('存在しないIDの場合はfalseを返すこと', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.deleteTodo('non-existent-id');

      expect(result).toBe(false);
      expect(mockStore.set).not.toHaveBeenCalled();
    });

    it('最後のTodoを削除できること', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.deleteTodo(testTodo.id);

      expect(result).toBe(true);
      expect(mockStore.set).toHaveBeenCalledWith('todos', []);
    });
  });

  describe('toggleTodo', () => {
    it('未完了のTodoを完了に変更できること', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.toggleTodo(testTodo.id);

      expect(result).toEqual({
        ...testTodo,
        completed: true,
        updatedAt: expect.any(String),
      });
    });

    it('完了済みのTodoを未完了に変更できること', () => {
      const todos = [testTodo2];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.toggleTodo(testTodo2.id);

      expect(result).toEqual({
        ...testTodo2,
        completed: false,
        updatedAt: expect.any(String),
      });
    });

    it('存在しないIDの場合はnullを返すこと', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.toggleTodo('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('clearCompleted', () => {
    it('完了済みのTodoを全て削除できること', () => {
      const todos = [testTodo, testTodo2];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.clearCompleted();

      expect(result).toBe(1); // 削除されたTodoの数
      expect(mockStore.set).toHaveBeenCalledWith('todos', [testTodo]);
    });

    it('完了済みのTodoが複数ある場合、全て削除できること', () => {
      const completedTodo1 = { ...testTodo, id: 'completed-1', completed: true };
      const completedTodo2 = { ...testTodo, id: 'completed-2', completed: true };
      const activeTodo = { ...testTodo, id: 'active-1', completed: false };

      const todos = [completedTodo1, activeTodo, completedTodo2];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.clearCompleted();

      expect(result).toBe(2); // 削除されたTodoの数
      expect(mockStore.set).toHaveBeenCalledWith('todos', [activeTodo]);
    });

    it('完了済みのTodoがない場合、何も削除しないこと', () => {
      const todos = [testTodo];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.clearCompleted();

      expect(result).toBe(0);
      expect(mockStore.set).toHaveBeenCalledWith('todos', [testTodo]);
    });

    it('全てのTodoが完了済みの場合、全て削除されること', () => {
      const completedTodo1 = { ...testTodo, id: 'completed-1', completed: true };
      const completedTodo2 = { ...testTodo, id: 'completed-2', completed: true };

      const todos = [completedTodo1, completedTodo2];
      mockStore.get.mockReturnValue(todos);

      const result = todoService.clearCompleted();

      expect(result).toBe(2);
      expect(mockStore.set).toHaveBeenCalledWith('todos', []);
    });
  });
});
