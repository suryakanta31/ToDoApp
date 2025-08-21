import React, { useState } from "react";
import axios from "axios";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // ✅ READ (Fetch todos on button click)
  const fetchTodos = async () => {
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // ✅ CREATE
  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post("https://jsonplaceholder.typicode.com/todos", {
        title,
        completed: false,
      });
      setTodos([res.data, ...todos]);
      setTitle("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // ✅ UPDATE
  const updateTodo = async (id) => {
    try {
      const res = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title: editingTitle,
        completed: false,
      });
      setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
      setEditingId(null);
      setEditingTitle("");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // ✅ DELETE
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 To-Do App (CRUD)</h1>

      {/* Fetch Button */}
      <button
        onClick={fetchTodos}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Load Todos
      </button>

      {/* Add Todo */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addTodo}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {editingId === todo.id ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  onClick={() => updateTodo(todo.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span>{todo.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
