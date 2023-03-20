const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Notes = require("../models/NotesSchema");
const { body, validationResult } = require("express-validator");

//Route 1 : Get All the Notes using : GET '/api/notes/fetchallnotes',Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.log(err.message);
    res.json({ message: "Error Occured" });
  }
});

//Route 2 : Post The New Notes using : POST '/api/notes/addNotes',Login required
router.post(
  "/addNotes",
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be a atleast 5 characters").isLength({
      min: 5,
    }), 
  ],
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //If there are errors , return the bad request and errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      // console.log(note)

      const savedNote = await note.save();

      // console.log(savedNote)

      res.json(savedNote);
    } catch (err) {
      console.log(err.message);
      res.json({ message: "Error Occured" });
    }
  }
);

//ROUTE 3 : update existing note PUT : 'api/notes/updatenote/:id'
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //create new note
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note }); 
  } catch (err) {
    console.log(err.message);
    res.json({ message: "Error Occured" });
  }
});

//ROUTE 4 : delete an existing note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // console.log(req.params.id)

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) res.status(404).send("Not Found"); 

    // console.log(note); 

    //allow deletion only if user owns the notes
    if (note.user?.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({ Success: "Note has been deleted", note });

  }catch (err) {
    console.log(err.message);
    res.json({ message: "Error Occured" });
  }
});   

module.exports = router;
