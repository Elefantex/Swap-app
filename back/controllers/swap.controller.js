const Swap = require("../models/swap");

exports.swaps = (req, res) => {
  //  const users = {};
  Swap.find().exec((err, swap) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(swap);
  });
};
exports.createSwap = (req, res) => {
  const { tipoSwap, date, inicio, fin, razon, rank, crewcode, roster, userId } = req.body;
  const newSwap = new Swap({
    tipoSwap,
    date,
    inicio,
    fin,
    razon,
    rank,
    crewcode,
    roster,
    userId
  }); newSwap.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Swap was created successfully!" });
  });
}
exports.deleteSwap = (req, res) => {
  const id = req.params.id;
  Swap.findByIdAndDelete(id, (err, swap) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!swap) {
      res.status(404).send({ message: `Swap with id ${id} not found.` });
      return;
    }
    res.send({ message: `Swap with id ${id} deleted successfully!` });
  });
};

exports.allSwaps = (req, res) => {
  const date = req.params.date;
  Swap.find({ date: date }, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err)
    }
    res.json(data)
  })
}

exports.swapsId = (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId); // add this line to check the received userId value
  
  Swap.find({ userId: userId }).exec((err, swaps) => {
    if (err) {
      console.log('Error:', err); // add this line to check if there's any error in the query
      res.status(500).send({ message: err });
      return;
    }

    console.log('Swaps:', swaps); // add this line to check if the query is returning any swaps
    res.send(swaps);
  });
};
