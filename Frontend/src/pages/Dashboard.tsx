import React, { useEffect, useState } from "react";
import API from "../Api";
import LogoutButton from "../components/LogoutButton";

interface Note {
  id: number;
  title: string;
  note: string;
  email: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await API.get("/notes");
        setNotes(res.data.notes);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchNotes();
    }
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !note) return alert("Please fill all fields");

    try {
      setSaving(true);
      const res = await API.post("/notes/create-note", { title, note });
      setNotes((prev) => [res.data, ...prev]);
      setTitle("");
      setNote("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await API.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err: any) {
      console.error(err);
      setError("Failed to delete note");
    }
  };

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Notes</h1>
      <LogoutButton />

      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />
        <textarea
          placeholder="Write your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Note"}
        </button>
      </form>

      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: "10px" }}>
              <strong>{note.title}</strong> <br />
              <small>{note.email}</small>
              <div>{note.note}</div>
              <button
                onClick={() => handleDelete(note.id)}
                style={{ color: "red", marginTop: "5px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
