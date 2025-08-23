import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Load demo todos automatically on first render
  useEffect(() => {
    const demoTodos = [
      { id: 1, title: "Welcome to Todo", completed: false },
      { id: 2, title: "Use this Todo App", completed: false },
    ];
    setTodos(demoTodos);
  }, []);

  const handleAdd = () => {
    if (newTodo.trim() === "") return;
    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleUpdate = (id) => {
    const updatedTitle = prompt("Update todo:");
    if (updatedTitle) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, title: updatedTitle } : todo
        )
      );
    }
  };

  const handleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo App</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter todo"
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "gray" : "black",
            }}
          >
            {todo.title}
            <button onClick={() => handleUpdate(todo.id)}>Edit</button>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
            <button onClick={() => handleComplete(todo.id)}>
              {todo.completed ? "Undo" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

