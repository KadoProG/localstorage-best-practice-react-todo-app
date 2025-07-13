import { useState } from 'react';
import type { TodoItem as TodoItemType } from '../utils/store';
import { store } from '../utils/store';

interface TodoItemProps {
  todo: TodoItemType;
  onUpdate: (todo: TodoItemType) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    const updatedTodo = store.toggleTodo(todo.id);
    if (updatedTodo) {
      onUpdate(updatedTodo);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim()) {
      const updatedTodo = store.updateTodo(todo.id, { text: editText.trim() });
      if (updatedTodo) {
        onUpdate(updatedTodo);
      }
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (store.deleteTodo(todo.id)) {
      onDelete(todo.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <span
            className={`block ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
            onDoubleClick={handleEdit}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm text-blue-600 transition-colors hover:text-blue-800"
          >
            完了
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm text-gray-600 transition-colors hover:text-blue-600"
          >
            編集
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm text-red-600 transition-colors hover:text-red-800"
        >
          削除
        </button>
      </div>
    </div>
  );
}
