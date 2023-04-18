const Note = require("../models/notes");

exports.notes = (req, res) => {
  //  const users = {};
  Note.find().exec((err, note) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(note);
  });
};
exports.createNote = (req, res) => {
  const { date, inicio, fin, razon, crewcode, userId, requested, denied } = req.body;
  const newNote = new Note({
    date,
    inicio,
    fin,
    razon,
    crewcode,
    userId,
    requested,
    denied
  }); newNote.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Note was created successfully!" });
  });
}
exports.deleteNote = (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id, (err, note) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!note) {
      res.status(404).send({ message: `Note with id ${id} not found.` });
      return;
    }
    res.send({ message: `Note with id ${id} deleted successfully!` });
  });
};

exports.allNotes = (req, res) => {
  const date = req.params.date;
  Note.find({ date: date }, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err)
    }
    res.json(data)
  })
}

exports.notesId = (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId); // add this line to check the received userId value

  Note.find({ userId: userId }).exec((err, notes) => {
    if (err) {
      console.log('Error:', err); // add this line to check if there's any error in the query
      res.status(500).send({ message: err });
      return;
    }

    console.log('Notes:', notes); // add this line to check if the query is returning any notes
    res.send(notes);
  });
};


exports.updateNoteRequested = (req, res) => {
  const _id = req.params.id; // assuming the user ID is passed as a parameter
  const {  requested,denied } = req.body;

  Note.findByIdAndUpdate(
    _id,
    {  requested,denied },
    { new: true },
    (err, updatedNote) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(updatedNote);
    }
  );
}
exports.updateNoteDenied = (req, res) => {
  const _id = req.params.id; // assuming the user ID is passed as a parameter
  const { denied,requested } = req.body;

  Note.findByIdAndUpdate(
    _id,
    { denied,requested },
    { new: true },
    (err, updatedNote) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(updatedNote);
    }
  );
}