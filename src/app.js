const express = require("express");
const noteRoutes = require("./routes/note.routes");

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

module.exports = app;
