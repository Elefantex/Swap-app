const User = require("../models/user");


exports.users = (req, res) => {
  const crewcode = req.query.crewcode;
  const filter = crewcode ? { crewcode } : {};

  User.find(filter).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(users);
  });
};

exports.getCrewcodes = (req, res) => {
  User.find({}, { crewcode: 1, _id: 0 }).exec((err, crewcodes) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send(crewcodes);
  });
};
exports.updateUser = (req, res) => {
  const userId = req.params.id; // assuming the user ID is passed as a parameter
  const { rank, roster, part, password } = req.body;

  User.findByIdAndUpdate(
    userId,
    { rank, roster, part, password },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(updatedUser);
    }
  );
}

exports.updateUserPassword = (req, res) => {
  const userId = req.params.id; // assuming the user ID is passed as a parameter
  const { id, crewcode, password } = req.body;

  User.findByIdAndUpdate(
    userId,
    { id, crewcode, password },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(updatedUser);
    }
  );
}


exports.createUser = async (req, res, next) => {
  try {
    const { email, password, rank, crewcode, roster, part } = req.body;

    // Check if a user with the given crewcode already exists
    const existingUser = await User.findOne({ crewcode });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with the given crewcode already exists' });
    }

    const newUser = new User({
      email,
      password,
      crewcode,
      roster,
      part,
      rank
    });

    await newUser.save();

    res.json({ message: 'User was created successfully!' });
  } catch (err) {
    console.log(err)
    throw new Error('Failed to create user');
  }
}

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id, (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      res.status(404).send({ message: `User with id ${id} not found.` });
      return;
    }
    res.send({ message: `User with id ${id} deleted successfully!` });
  });
};

exports.login = async (req, res) => {
  const { crewcode, password } = req.body;

  try {
    const user = await User.findOne({ crewcode, password }).exec();
    if (!user) {
      return res.status(401).send({ message: "Invalid crewcode or password" });
    }

    res.send({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
exports.loginRecover = async (req, res) => {
  const { crewcode, rank, email } = req.body;

  try {
    const user = await User.findOne({ crewcode, rank, email }).exec();
    if (!user) {
      return res.status(401).send({ message: "Invalid crewcode or password" });
    }

    res.send({ message: "Login recover successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
exports.recoverPassword = async (req, res) => {
  const { crewcode, rank, email } = req.body;

  try {
    const user = await User.findOne({ crewcode, rank, email }).exec();
    if (!user) {
      return res.status(401).send({ message: "Invalid crewcode or password" });
    }

    res.send({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
exports.recoverPasswordCreateUser = async (req, res) => {
  const { _id, password } = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id }, { password }, { new: true });
    if (!user) {
      return res.status(401).send({ message: "Invalid _id or password" });
    }

    res.send({ message: "Password updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
exports.userInfo = (req, res) => {
  const id = req.params.id;

  User.findById(id).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.send(user);
  });
};

exports.usersWithPart = (req, res) => {
  User.find({ part: true }).exec((err, users) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!users.length) {
      res.status(404).send({ message: "No users found" });
      return;
    }
    res.send(users);
  });
};





