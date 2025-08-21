import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const handleAdd = () => {
    if (newTodo.trim() === "") return;
    const todo = {
      id: Date.now(),
      title: newTodo,
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
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => handleUpdate(todo.id)}>Edit</button>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
