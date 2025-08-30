import pool from "../db.js";

export default {
  // Create a new note
  createNote: async (req, res) => {
    const { note, title } = req.body;
    try {
      const { id } = req.user; // comes from JWT middleware
      const newNote = await pool.query(
        "INSERT INTO notes (user_id, note, title) VALUES ($1, $2, $3) RETURNING *",
        [id, note, title]
      );
      res.status(201).json(newNote.rows[0]);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all notes of the logged-in user
  getNotes: async (req, res) => {
    try {
      const { id, email } = req.user;
      const notes = await pool.query("SELECT * FROM notes WHERE user_id = $1", [id]);
      res.status(200).json({ notes: notes.rows, email });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a note (only by its owner)
  deleteNote: async (req, res) => {
    const { noteId } = req.params;
    try {
      const { id } = req.user;

      // check ownership before deleting
      const note = await pool.query("SELECT * FROM notes WHERE id = $1 AND user_id = $2", [
        noteId,
        id,
      ]);

      if (note.rows.length === 0) {
        return res.status(404).json({ message: "Note not found or not yours" });
      }

      await pool.query("DELETE FROM notes WHERE id = $1", [noteId]);

      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
