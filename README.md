# Notes REST API (Assignment 03)

A backend project built from scratch using Node.js, Express, and MongoDB. It implements full CRUD operations, pagination, sorting, search functionality using MongoDB `$regex`, and combination query endpoints culminating in a master query builder endpoint.

## Tech Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database Wrapper:** Mongoose (MongoDB)
- **Environment Variables:** dotenv
- **Development Tooling:** nodemon

## Folder Structure
```
notes-app/
│
├── src/
│   ├── config/
│   │   └── db.js              # Database Connection
│   ├── models/
│   │   └── note.model.js      # Mongoose Note Schema
│   ├── controllers/
│   │   └── note.controller.js # Endpoint Business Logic
│   ├── routes/
│   │   └── note.routes.js     # Route mappings in correct order
│   ├── app.js                 # Express Middlewares and Routing Setup
│   └── index.js               # Database Connection & Listening Server
│
├── .env                       # Local Environment Variables
└── package.json               # Node Package configuration
```

## Schema Model
```javascript
const noteSchema = new mongoose.Schema(
  {
    title:    { type: String, required: [true, "Title is required"] },
    content:  { type: String, required: [true, "Content is required"] },
    category: { type: String, enum: ["work", "personal", "study"], default: "personal" },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
```

## API Documentation

### 1. CRUD Endpoints

#### POST `/api/notes` - Create a Single Note
- **Body:** `{ title: string, content: string, category?: string, isPinned?: boolean }`
- **Response (201):** Note object

#### POST `/api/notes/bulk` - Create Multiple Notes
- **Body:** `{ notes: [{ title, content, category, isPinned }] }`
- **Response (201):** Created notes array

#### GET `/api/notes` - Fetch All Notes
- **Response (200):** Notes array with `count` field

#### GET `/api/notes/:id` - Fetch Note by ID
- **Response (200):** Single note object

#### PUT `/api/notes/:id` - Full Replace Note
- **Body:** `{ title, content, category?, isPinned? }`
- **Response (200):** Overwritten note object

#### PATCH `/api/notes/:id` - Partial Update Note
- **Body:** `{ isPinned?, category?, content?, title? }`
- **Response (200):** Updated note object

#### DELETE `/api/notes/:id` - Delete Single Note
- **Response (200):** Null data

#### DELETE `/api/notes/bulk` - Delete Multiple Notes
- **Body:** `{ ids: [string] }`
- **Response (200):** Deletion count message

---

### 2. Search Endpoints (MongoDB `$regex`)

#### GET `/api/notes/search?q=keyword` - Search in Title Only
- **Query Params:** `q` (required)
- **Response (200):** Matches array

#### GET `/api/notes/search/content?q=keyword` - Search in Content Only
- **Query Params:** `q` (required)
- **Response (200):** Matches array

#### GET `/api/notes/search/all?q=keyword` - Search in Title and Content
- **Query Params:** `q` (required)
- **Response (200):** Matches array

---

### 3. Combination Query Endpoints

#### GET `/api/notes/filter-sort` - Category/Pin Filter + Sort
- **Query Params:** `category`, `isPinned`, `sortBy` (default: `createdAt`), `order` (default: `desc`)

#### GET `/api/notes/filter-paginate` - Category/Pin Filter + Paginate
- **Query Params:** `category`, `isPinned`, `page` (default: `1`), `limit` (default: `10`)

#### GET `/api/notes/sort-paginate` - Sort + Paginate
- **Query Params:** `sortBy`, `order`, `page`, `limit`

#### GET `/api/notes/search-filter` - Title/Content Search + Category/Pin Filter
- **Query Params:** `q` (required), `category`, `isPinned`

#### GET `/api/notes/search-sort-paginate` - Search + Sort + Paginate
- **Query Params:** `q` (required), `sortBy`, `order`, `page`, `limit`

#### GET `/api/notes/filter-sort-paginate` - Category/Pin Filter + Sort + Paginate
- **Query Params:** `category`, `isPinned`, `sortBy`, `order`, `page`, `limit`

---

### 4. Master Query Endpoint

#### GET `/api/notes/query` - Advanced Query Builder (Everything Combined)
All query parameters are optional. When combined, this endpoint handles search, filter, sorting, and pagination in a single database execution:
- **Query Params:** `q`, `category`, `isPinned`, `sortBy`, `order`, `page`, `limit`
- **Response (200):** Array with `pagination` metadata

---

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file at the root of the workspace:
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   PORT=5000
   ```

3. **Run Application:**
   - Development mode (with nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```
