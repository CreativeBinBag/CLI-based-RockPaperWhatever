// Importing modules
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("..");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require('sequelize');

const {User} = db;

// Registering a user

const register = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.secretKey, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, process.env.refreshSecretKey, { expiresIn: '7d' });

      res.cookie("jwt", token, { maxAge: 15 * 60 * 1000, httpOnly: true });
      res.cookie("refreshJwt", refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.status(201).send(user);
    } else {
      return res.status(400).send("Username or Email is Taken");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};


//login authentication

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ where: { userName } });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.secretKey, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, process.env.refreshSecretKey, { expiresIn: '7d' });

      res.cookie("jwt", token, { maxAge: 15 * 60 * 1000, httpOnly: true });
      res.cookie("refreshJwt", refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.status(200).json({ id: user.id, userName: user.userName, email: user.email, role: user.role, token, refreshToken });
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

 //Forgot Password - generate reset token and send it using email

 const pwdResetReq = async(req, res) => {
  try{

    const {email} = req.body;
    const user = await User.findOne({ 
      
      where: {email}
    
  });
  if(!user){
    return res.status(404).send('User Not Found');
  }

  //generate token for reset
  const recoveryToken = crypto.randomBytes(32).toString('hex');
  user.recoveryToken = recoveryToken;
  user.recoveryTokenExp = Date.now() + 3600000;
  await user.save();

  //send email with generated token for reset

  const sender = nodemailer.createTransport({

    service: 'gmail',
    port: 465,
    secure: true,
    logger:true,
    debug: true,
    secureConnection: false,
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized:true
    }

  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Hi ${user.userName}, you requested a password reset. Click the following link to reset your password:http://localhost:3000/reset-password/${recoveryToken}`
  };

  await sender.sendMail(mailOptions);

  res.status(200).send('Password reset email sent');
  
}catch(error){
    console.log(error);
    res.status(500).send('Internal server error');
  }
 };

 //Forgot Password - Reset

 const pwdReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token and check expiry
    const user = await User.findOne({
      where: {
        recoveryToken: token,
        recoveryTokenExp: { [Op.gt]: Date.now() },
      },
    });
    
    if (!user) {
      return res.status(400).send('Token is invalid or has expired');
    }

    // Hash new password and save
    user.password = await bcrypt.hash(password, 10);
    user.recoveryToken = null;
    user.recoveryTokenExp = null;
    await user.save();
    
    res.status(200).send('Password has been reset');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


// Get all users

const getAllUsers = async (req, res) => {
  try{

    const users = await User.findAll();
    res.status(200).json(users);
  }catch(error){
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


// Block or Unblock a user based on the current status
const toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send('User Not Found');
    
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    await user.update({ status: newStatus });
    res.status(200).send(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error toggling user block status');
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).send('User Not Found');
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// Update a user's role
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || !['user', 'admin'].includes(req.body.role)) return res.status(400).send('Invalid request');
    
    // Prevent the current admin from demoting themselves
/*    if (req.user.id === req.params.id && req.body.role === 'user') {
      await user.update({ role: 'user' });
      // Log out the current admin
      res.clearCookie('jwt'); 
      res.clearCookie('refreshJwt');
      return res.status(200).send('Role updated, logging out...');
    }  */

    await user.update({ role: req.body.role });
    res.status(200).send('User role updated successfully');
  } catch (error) {
    console.error('Error updating user role:', error); // Log the error
    res.status(500).send('Internal Server Error');
  }
};

const checkAuthStatus = async (req, res) => {
  console.log("Reached checkAuthStatus");

  try {
    const token = req.cookies.jwt;

    if (!token) {
      // Try to refresh the token using the refreshToken
      const refreshToken = req.cookies.refreshJwt;
      if (refreshToken) {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.refreshSecretKey);
        const user = await User.findByPk(decodedRefreshToken.id);
        
        if (user) {
          // Issue a new token
          const newToken = jwt.sign({ id: user.id }, process.env.secretKey, { expiresIn: '15m' });
          res.cookie("jwt", newToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
          
          return res.status(200).json({
            id: user.id,
            userName: user.userName,
            email: user.email,
            role: user.role
          });
        }
      }
      return res.status(401).send('Not authenticated');
    }

    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).send('Internal server error');
  }
};



//Logout
const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.cookie('refreshJwt', '', { maxAge: 1 });
  res.status(200).send('Logged out');
};




module.exports = { register,login, pwdResetReq, pwdReset, logout, getAllUsers, toggleBlockUser, deleteUser, updateUserRole, checkAuthStatus};