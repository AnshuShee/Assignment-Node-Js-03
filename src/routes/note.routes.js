const express = require("express");
const router = express.Router();
const { createNote } = require("../controllers/note.controller");

// CRUD single-item routes LAST
router.post("/", createNote);

module.exports = router;
