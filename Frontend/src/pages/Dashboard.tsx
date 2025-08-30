import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api"; // change to your backend API

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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("jwt");

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data.notes);
        console.log("Fetched notes:", res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) {
      fetchNotes();
    }
  }, [user?.id, token]);

  // Create note
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !note) return alert("Please fill all fields");

    try {
      setSaving(true);
      const res = await axios.post(
        `${API}/notes/create-note`,
        {
          title,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes((prev) => [res.data, ...prev]); // add new note on top
      setTitle("");
      setNote("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  // Delete note
  const handleDelete = async (noteId: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`${API}/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

      {/* Create Note Form */}
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

      {/* Notes List */}
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
