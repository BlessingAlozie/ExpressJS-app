const jwt = require('jsonwebtoken')


const protect = (req, res, next) =>{
    // Get token from request header
    const header = req.headers.authorization

      // Check if token exists
      if(!header || !header.startsWith('Bearer ')){ //the space after the 'Bearer ' is intentional
        return res.status(401).json({message: 'No token, access denied'})
      }
  // Extract the token
  const token = header.split(' ')[1]

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
  } 
  catch (error) {
    res.status(401).json({message: 'Invalid token'})
    
  }
}

module.exports = protect