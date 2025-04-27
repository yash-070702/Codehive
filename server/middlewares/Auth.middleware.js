const jwt=require('jsonwebtoken');
const User=require('../models/User.model');
require('dotenv').config();


exports.auth = async (req, res, next) => {
	try {
	  // Extract JWT token from cookies, body, or header
// 	  console.log("Cookies:", req.cookies);
// console.log("Body:", req.body);
// console.log("Headers:", req.headers);

	  const token = 
		req.cookies.token ||
		req.body.token ||
		(req.header("Authorization") && req.header("Authorization").replace("Bearer ", "").trim());
		//  console.log(token,"mai hu");
  
	  // If JWT is missing, return response
	  if (!token) {
		return res.status(401).json({ success: false, message: "Token Missing" });
	  }
  
	  try {
		// Verifying the JWT token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		req.user = decoded; // Attach decoded user information to the request object
		next();
	  } catch (error) {
		return res.status(401).json({ success: false, message: error.message });
	  }
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: "Something went wrong while validating the token",
	  });
	}
  };
  