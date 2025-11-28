const authService = require('../services/authService');


const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Simple validation
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'All data required.' });
    }

    const user = await authService.register(firstname, lastname, email, password);
    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required.' });
  }
  try {
    const { refreshToken, accessToken } = await authService.login(email, password);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });


    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login Service Error:", error);
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
};

const handleRefreshToken = async (req, res) => {

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }
  try {
    const { accessToken } = authService.refreshToken(token);
    res.json({ accessToken });

  } catch (err) {
    res.status(401).json({ message: 'Refresh token is invalid or expired.', error: err.message });
  }
};

const handleLogout = async (req, res) => {

  const userID = req.params.id;

  if (!userID) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {

    const loggedOut = await authService.logout(userID);
    res.status(200).json({ message: loggedOut.message });

  } catch (err) {
    res.status(500).json({ message: 'Error logging out.', error: err.message });
  }

}

const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "email and otp required!" });
  }
  try {
    const verified = await authService.verifyOTP(email, otp);
    console.log(verified);
    res.status(200).json({ message: verified.message });

  } catch (err) {
    res.status(500).json({ message: "Error Verifying User email" });
  }
}

module.exports = {
  login,
  register,
  handleRefreshToken,
  handleLogout,
  verifyUser
};
