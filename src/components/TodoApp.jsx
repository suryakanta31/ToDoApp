
import React, { useState } from "react";

const API = "https://jsonplaceholder.typicode.com/todos";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  async function loadTodos() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}?_limit=8`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      setError(`Failed to load todos: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    const value = title.trim();
    if (!value) return;
    setError("");

    const tempId = Date.now();
    const optimistic = { id: tempId, title: value, completed: false };
    setTodos(prev => [optimistic, ...prev]);
    setTitle("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value, completed: false })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setTodos(prev => prev.map(t => t.id === tempId ? { ...optimistic, ...saved } : t));
    } catch (e) {
      setError(`Failed to add: ${e.message}`);
      setTodos(prev => prev.filter(t => t.id !== tempId));
    }
  }

  async function saveEdit(id) {
    const value = editingTitle.trim();
    if (!value) return;
    setError("");

    const previous = todos;
    const updated = todos.map(t => t.id === id ? { ...t, title: value } : t);
    setTodos(updated);

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated.find(t => t.id === id))
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEditingId(null);
      setEditingTitle("");
    } catch (e) {
      setError(`Failed to update: ${e.message}`);
      setTodos(previous);
    }
  }

  async function removeTodo(id) {
    setError("");
    const previous = todos;
    setTodos(todos.filter(t => t.id !== id));

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(`Failed to delete: ${e.message}`);
      setTodos(previous);
    }
  }

  return (
    <div>
      <div className="row" style={{ marginBottom: 12 }}>
        <input
          placeholder="New task…"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
        <button className="secondary" onClick={loadTodos} disabled={loading}>
          {loading ? "Loading…" : "Load Todos"}
        </button>
      </div>

      {error && <div className="pill" style={{ marginBottom: 12 }}>{error}</div>}

      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <div className="grid">
              {editingId === t.id ? (
                <input
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                />
              ) : (
                <span className="title">{t.title}</span>
              )}
              <div className="actions">
                {editingId === t.id ? (
                  <>
                    <button onClick={() => saveEdit(t.id)}>Save</button>
                    <button className="ghost" onClick={() => { setEditingId(null); setEditingTitle(""); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="secondary" onClick={() => { setEditingId(t.id); setEditingTitle(t.title); }}>Edit</button>
                    <button className="warn" onClick={() => removeTodo(t.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
            <span className="muted">id: {t.id}</span>
          </li>
        ))}
      </ul>

      {!todos.length && (
        <div className="muted" style={{ marginTop: 6 }}>No todos yet. Click “Load Todos”.</div>
      )}
    </div>
  );
}
