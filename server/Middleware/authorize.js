const jwt = require("jsonwebtoken");
const db = require("..")
const {User} = db;

const authenticateUser = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    const refreshToken = req.cookies.refreshJwt;

    if (!token && refreshToken) {
      // Verify and refresh the access token using the refresh token
      const decoded = jwt.verify(refreshToken, process.env.refreshSecretKey);
      const user = await User.findByPk(decoded.id);

      if (user) {
        token = jwt.sign({ id: user.id }, process.env.secretKey, { expiresIn: '15m' });
        res.cookie("jwt", token, { maxAge: 15 * 60 * 1000, httpOnly: true });
      } else {
        return res.status(401).send('Unauthorized');
      }
    } else if (!token) {
      return res.status(401).send('Unauthorized');
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user || user.status === 'blocked') {
      return res.status(user ? 403 : 401).json({ message: user ? 'Your account has been blocked.' : 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Unauthorized');
  }
};


const authorizeAdmin = (req, res, next) => {
  console.log(`User Role: ${req.user.role}`);

  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden: Admins only');
  }

  next();
};

module.exports = { authenticateUser, authorizeAdmin };