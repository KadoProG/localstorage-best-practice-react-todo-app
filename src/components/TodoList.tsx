import { useState, useEffect } from 'react';
import type { TodoItem } from '../utils/store';
import { store } from '../utils/store';
import { TodoItem as TodoItemComponent } from './TodoItem';

type FilterType = 'all' | 'active' | 'completed';

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    // 初期データを読み込み
    setTodos(store.getTodos());
  }, []);

  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo = store.addTodo(text.trim());
      setTodos((prev) => [...prev, newTodo]);
      setNewTodoText('');
    }
  };

  const updateTodo = (updatedTodo: TodoItem) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    const deletedCount = store.clearCompleted();
    if (deletedCount > 0) {
      setTodos(store.getTodos());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(newTodoText);
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">TODOアプリ</h1>
          <p className="text-gray-600">localStorageでデータを管理するTODOアプリ</p>
        </div>

        {/* 新しいTODO入力 */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="新しいTODOを入力..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTodoText.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              追加
            </button>
          </div>
        </form>

        {/* TODOリスト */}
        <div className="mb-6 space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {filter === 'all'
                ? 'TODOがありません'
                : filter === 'active'
                  ? 'アクティブなTODOがありません'
                  : '完了したTODOがありません'}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItemComponent
                key={todo.id}
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* フィルターと統計 */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4 sm:flex-row">
          <div className="text-sm text-gray-600">{activeTodos.length} 個のアクティブなTODO</div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                filter === 'active' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              アクティブ
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              完了済み
            </button>
          </div>

          {completedTodos.length > 0 && (
            <button
              onClick={clearCompleted}
              className="px-3 py-1 text-sm text-red-600 transition-colors hover:text-red-800"
            >
              完了済みを削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
