const express = require("express");
const router = express.Router();


const noteController = require("../controllers/note.controller")

router.get("/notes", noteController.notes)
router.delete("/notes/:id", noteController.deleteNote)
router.post("/notes", noteController.createNote)
router.get("/notes/:date", noteController.allNotes)
router.get("/notes/:id",noteController.notesId)
router.put("/notes/:id/requested", noteController.updateNoteRequested)
router.put("/notes/:id/denied", noteController.updateNoteDenied)




module.exports = router