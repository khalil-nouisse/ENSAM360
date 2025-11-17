const authService = require('../services/authService');


const register = async (req, res) => {
  try {
    const { firstname, lastname , email , password } = req.body;
    
    // Simple validation
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'All data required.' });
    }

    const user = await authService.register(firstname, lastname , email , password );
    res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req , res) => {
    const {email , password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }
    try{
        const {refreshToken , accessToken} = await authService.login(email , password);

        res.cookie('jwt',refreshToken,{
            httpOnly:true,
            maxAge:24*60*60*1000
        });

        res.status(200).json({accessToken});
    }catch(err) {
        res.status(401).json({ message: 'Login failed', error: error.message });
    }
};


module.exports = {
    login , 
    register
}
