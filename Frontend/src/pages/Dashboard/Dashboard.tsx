import React, { useEffect, useState } from "react";
import API from "../../Api";
import LogoutButton from "../../components/LogoutButton";
import reactLogo from "../../assets/react.svg";
import { FaTrash } from "react-icons/fa";
import styles from "./Dashboard.module.css";

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
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await API.get("/notes");
        console.log(res.data);
        setNotes(res.data.notes);
        setEmail(res.data.email);
        setUsername(res.data.username);
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

  const toggleEmailVisibility = () => {
    setShowEmail((prev) => !prev);
  };

  const handleNote = () => {
    setShowNote((prev) => !prev);
  };

  const handleForm = () => {
    setShowForm((prev) => !prev);
  };

  const maskedEmail = email.replace(/.(?=.*@)/g, "*");

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
    <>
      <header className={styles["header"]}>
        <div>
          <div className={styles["header-logo"]}>
            <img src={reactLogo} alt="React logo" />
          </div>
          <div  className={styles["header-title"]}>
            <p>Welcome</p>
          </div>
        </div>

        <div>
          <LogoutButton />
        </div>
      </header>
      <main className={styles["main"]}>
        <div className={styles["hero"]}>
          <h1>Welcome, {username} !</h1>
          <p >
           Email: <span onClick={toggleEmailVisibility}>{showEmail ? email : maskedEmail}</span>
          </p>
        </div>
        <button onClick={handleForm}>Create Note</button>
        {showForm && (
          <form onSubmit={handleCreate} className={styles["note-form"]}>
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
        )}
        <div>
          <h2>Notes</h2>
          {notes.length === 0 ? (
            <p>No notes found</p>
          ) : (
            <ul>
              {notes.map((note) => (
                <li key={note.id} >
                  <div className={styles["note-item"]}>
                    <span onClick={handleNote}> {note.title}</span>
                    <FaTrash
                      className={styles["trash"]}
                      onClick={() => {
                        handleDelete(note.id);
                      }}
                    />
                  </div>
                  {showNote && <div>{note.note}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
