const express = require("express");
const router = express.Router();
const { createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, deleteBulkNotes, searchByTitle, searchByContent } = require("../controllers/note.controller");

// CRUD bulk
router.post("/bulk", createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

// Search routes
router.get("/search/content", searchByContent);
router.get("/search", searchByTitle);

// CRUD single-item routes LAST
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
