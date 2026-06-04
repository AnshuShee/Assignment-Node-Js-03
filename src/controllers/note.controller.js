const mongoose = require("mongoose");
const Note = require("../models/note.model");

// 1. POST /api/notes - Create a single note
const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }

    const newNote = await Note.create({
      title,
      content,
      category,
      isPinned,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 2. POST /api/notes/bulk - Create multiple notes
const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null,
      });
    }

    // Validate that each note has title and content
    for (const note of notes) {
      if (!note.title || !note.content) {
        return res.status(400).json({
          success: false,
          message: "Title and content are required for all notes",
          data: null,
        });
      }
    }

    const createdNotes = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 3. GET /api/notes - Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 4. GET /api/notes/:id - Get note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 5. PUT /api/notes/:id - Full replace
const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null,
      });
    }

    const replacedNote = await Note.findByIdAndUpdate(
      id,
      req.body,
      { new: true, overwrite: true, runValidators: true }
    );

    if (!replacedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: replacedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 6. PATCH /api/notes/:id - Partial update
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data: null,
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 7. DELETE /api/notes/:id - Delete single note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null,
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 8. DELETE /api/notes/bulk - Delete multiple notes
const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null,
      });
    }

    // Validate that each ID in the array is a valid mongoose ObjectId
    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ID: ${id}`,
          data: null,
        });
      }
    }

    const deleteResult = await Note.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} notes deleted successfully`,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 9. GET /api/notes/search - Search in title only
const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find({
      title: { $regex: q, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 10. GET /api/notes/search/content - Search in content only
const searchByContent = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find({
      content: { $regex: q, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: `Content search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 11. GET /api/notes/search/all - Search in title AND content
const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const notes = await Note.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 12. GET /api/notes/filter-sort - Filter + Sort
const filterAndSort = async (req, res) => {
  try {
    const { category, isPinned, sortBy, order } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";

    const allowedSortFields = ["title", "createdAt", "updatedAt", "category"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const notes = await Note.find(filter).sort({ [sortField]: sortOrder });

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 13. GET /api/notes/filter-paginate - Filter + Paginate
const filterAndPaginate = async (req, res) => {
  try {
    const { category, isPinned, page, limit } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter).skip(skip).limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 14. GET /api/notes/sort-paginate - Sort + Paginate
const sortAndPaginate = async (req, res) => {
  try {
    const { sortBy, order, page, limit } = req.query;

    const allowedSortFields = ["title", "createdAt", "updatedAt", "category"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Note.countDocuments();
    const notes = await Note.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// 15. GET /api/notes/search-filter - Search + Filter
const searchAndFilter = async (req, res) => {
  try {
    const { q, category, isPinned } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required",
        data: null,
      });
    }

    const filter = {};
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];

    if (category) filter.category = category;
    if (isPinned !== undefined) filter.isPinned = isPinned === "true";

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: `Search results for: ${q}`,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  searchByTitle,
  searchByContent,
  searchAll,
  filterAndSort,
  filterAndPaginate,
  sortAndPaginate,
  searchAndFilter,
};
