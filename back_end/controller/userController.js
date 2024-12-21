const dbConnection = require('../db/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all required information' });
    }

    try {
        const [result] = await dbConnection.query(`SELECT * FROM userTable WHERE email = ?`, [email]);

        // Check if a user exists
        if (!result || result.length === 0) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }

        const user = result[0];
        const { password: hashedPassword, username, userId } = user;

        // Debugging logs
        console.log('Provided password:', password);
        console.log('Hashed password from DB:', hashedPassword);

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials. Please try again.' });
        }

        // Generate access token
        const accessToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { username, userId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Set the refresh token as an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Respond with success message
        return res.status(200).json({ msg: 'Login successful', accessToken, email, username });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ msg: 'Something went wrong' });
    }
}

// router.post('/login', async(req,res)=>{
//     const {username, password} = req.body

//     if (!email || !password) {
//         return res.status(400).json({ msg: 'Please enter all required information' });
//     }
//     try{
//         const user = await dbConnection.query(`SELECT * FROM userTable WHERE email = ? `, [email])
//         if(!user){
//             return res.status(401).json({ msg: 'Invalid Credentials' });
//         }
//         const { email , password: hashedPassword } = user[0];
//         const isMatch = await bcrypt.compare(password, hashedPassword);
//         if (!isMatch) {
//             return res.status(401).json({ msg: 'Invalid Credentials. please try again.' });
//         }
//         const accessToken = jwt.sign(
//             { ElementInternals },
//             process.env.JWT_SECRET,
//             { expiresIn: '15m' }  
//         );

//         const refreshToken = jwt.sign(
//             { email},
//             process.env.JWT_REFRESH_SECRET,
//             { expiresIn: '7d' } 
//         );
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', 
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000 
//         });

//         return res.status(200).json({ msg: 'Login successful', accessToken, role , username });

//     } 
//     catch(err){
//         console.error('Login error:', error);
//         return res.status(500).json({ msg: 'Something went wrong' });
//     }

// })
// async function signUp(req,res){
//     const {  username, firstName, LastName, email, password } = req.body;

//     // Check if all required fields are provided
//     if (!username || !firstName || !LastName || !email || !password) {
//         return res.status(400).json({ message: 'All info is required' });
//     }


//     dbConnection.query('SELECT * FROM UserTable WHERE email = ?', [email], async (err, result) => {
//         try {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({ msg: 'Something went wrong' });
//             }

            
//             if (result.length > 0) {
//                 return res.status(401).json({ message: 'Email already exists' });
//             }

            
//             const hashedPassword = await bcrypt.hash(password, 10);

            
//             dbConnect.query(
//                 `INSERT INTO UserTable (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)`,
//                 [username, firstName, lastName, email, hashedPassword],
//                 (err, result) => {
//                     if (err) {
//                         console.log(err);
//                         return res.status(500).json({ msg: 'Something went wrong during insertion' });
//                     }
//                     res.status(201).json({ message: 'Sign up successful' });
//                 }
//             );
//         } catch (err) {
//             console.log(err);
//             return res.status(500).json({ msg: 'Something went wrong' });
//         }
//     });
// }
async function signUp(req, res) {
    const { username, firstName, LastName, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !firstName || !LastName || !email || !password) {
        return res.status(400).json({ message: 'All info is required' });
    }

    try {
        // Check if the email already exists
        const [existingUser] = await dbConnection.execute('SELECT * FROM UserTable WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await dbConnection.execute(
            'INSERT INTO UserTable (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)',
            [username, firstName, LastName, email, hashedPassword]
        );

        res.status(201).json({ message: 'Sign up successful' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

// router.post('/signup', (req, res) => {
//     const { username, first_name, last_name, email, password } = req.body;

//     // Check if all required fields are provided
//     if (!username || !first_name || !last_name || !email || !password) {
//         return res.status(400).json({ message: 'All info is required' });
//     }


//     dbConnection.query('SELECT * FROM UserTable WHERE email = ?', [email], async (err, result) => {
//         try {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({ msg: 'Something went wrong' });
//             }

            
//             if (result.length > 0) {
//                 return res.status(401).json({ message: 'Email already exists' });
//             }

            
//             const hashedPassword = await bcrypt.hash(password, 10);

            
//             dbConnect.query(
//                 `INSERT INTO UserTable (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)`,
//                 [username, first_name, last_name, email, hashedPassword],
//                 (err, result) => {
//                     if (err) {
//                         console.log(err);
//                         return res.status(500).json({ msg: 'Something went wrong during insertion' });
//                     }

                    
//                     res.status(201).json({ message: 'Sign up successful' });
//                 }
//             );
//         } catch (err) {
//             console.log(err);
//             return res.status(500).json({ msg: 'Something went wrong' });
//         }
//     });
// });

async function checkUser(req , res) {
    res.json("work correctly")
}

module.exports = {login , signUp , checkUser}