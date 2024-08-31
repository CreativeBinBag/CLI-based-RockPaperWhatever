// Importing modules
const db = require("..");

// Assigning db.users to User variable
const {User} = db;

// Function to check if username or email already exist in the database
// this is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
  try {
    // Search the database to see if user exist
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });
    // If username exist in the database respond with a status of 409
    if (username) {
      return res.status(409).send("Username already taken"); // Return early
    }

    // Checking if email already exist
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // If email exist in the database respond with a status of 409
    if (emailcheck) {
      return res.status(409).send("Authentication failed"); // Return early
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error"); // Ensure this is the only response in the catch block
  }
};

// Exporting module
module.exports = {
  saveUser
};