const dbConnection = require('../db/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  {StatusCodes} = require('http-status-codes')
require('dotenv').config(); 

// async function login(req, res) {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ msg: 'Please enter all required information' });
//     }

//     try {
//         const [result] = await dbConnection.query(`SELECT * FROM userTable WHERE email = ?`, [email]);

//         // Check if a user exists
//         if (!result || result.length === 0) {
//             return res.status(401).json({ msg: 'Invalid Credentials' });
//         }

//         const user = result[0];
//         const { password: hashedPassword, username, userId } = user;

//         // Debugging logs
//         console.log('Provided password:', password);
//         console.log('Hashed password from DB:', hashedPassword);

//         const isMatch = await bcrypt.compare(password, hashedPassword);
//         if (!isMatch) {
//             return res.status(401).json({ msg: 'Invalid Credentials. Please try again.' });
//         }

//         // Generate access token
//         // const accessToken = jwt.sign(
//         //     { username, userId },
//         //     process.env.JWT_SECRET,
//         //     { expiresIn: '15m' }
//         // );
//         const token = jwt.sign({ username, userid }, secret, {
//             expiresIn: "1d", // Token expires in 1 day
//         });
//         // Generate refresh token
//         // const refreshToken = jwt.sign(
//         //     { username, userId },
//         //     process.env.JWT_REFRESH_SECRET,
//         //     { expiresIn: '7d' }
//         // );

//         // // Set the refresh token as an HTTP-only cookie
//         // res.cookie('refreshToken', refreshToken, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production',
//         //     sameSite: 'strict',
//         //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         // });

//         // Respond with success message
//         return res.status(200).json({ msg: 'Login successful', token, email, username });

//     } catch (err) {
//         console.error('Login error:', err);
//         return res.status(500).json({ msg: 'Something went wrong' });
//     }
// }
async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide all required fields' });
    }

    try {
        const [user] = await dbConnection.query("SELECT username, userid, password FROM userTable WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid username or password' });
        }

        const username = user[0].username;
        const userID = user[0].userid;
        const secret = process.env.JWT_SECRET;
        console.log("Signing token with:", { username, userID });

        const token = jwt.sign({ username, userID }, secret, { expiresIn: '1d' });

        return res.status(StatusCodes.OK).json({
            msg: 'User logged in successfully',
            token: token,
        });
    } catch (error) {
        console.log(error.message); // Log the actual error
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'An unexpected error occurred.',
            error: error.message, // Send the error message for debugging
        });
    }
}



async function signUp(req, res) {
    const { username, firstName, LastName, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !firstName || !LastName || !email || !password) {
        return res.status(400).json({ message: 'All info is required' });
    }

    try {
        // Check if the email already exists
        const [existingUser] = await dbConnection.execute('SELECT * FROM userTable WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await dbConnection.execute(
            'INSERT INTO userTable (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)',
            [username, firstName, LastName, email, hashedPassword]
        );

        res.status(201).json({ message: 'Sign up successful' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
function checkUser(req, res) {
    const { username, userID } = req.user;  // Destructure to get both username and userID
    console.log("Server response:", { username, userID });
    return res.status(200).json({ username, userID }); 
}

module.exports = {login , signUp , checkUser}
