const express = require("express");
const router = express.Router();
const { createNote, createBulkNotes } = require("../controllers/note.controller");

// CRUD bulk
router.post("/bulk", createBulkNotes);

// CRUD single-item routes LAST
router.post("/", createNote);

module.exports = router;
