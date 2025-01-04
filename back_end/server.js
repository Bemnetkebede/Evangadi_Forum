const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const questionRouter = require('./routes/questionRoutes');
const answerRouter = require('./routes/AnswerRoutes');
const dbConnection = require('./db/dbConfig');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://evangadiforum-g2.netlify.app/'], // Allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware globally
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/user', userRouter);
app.use('/api', questionRouter);
app.use('/api', answerRouter);

// Start server
async function start() {
    try {
        const result = await dbConnection.execute("SELECT 'test'");
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, (err) => {
        if (err) console.log(err);
        console.log('Successfully connected to DB');
        console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
}
start();



// const express = require('express')
// const cors = require('cors')
// const userRouter = require('./routes/userRoutes')
// const questionRouter = require('./routes/questionRoutes')
// const answerRouter = require('./routes/AnswerRoutes')

// const dbConnection = require('./db/dbConfig')


// const app = express()
// const corsOptions = {
//     origin: ['http://localhost:3000', 'https://calm-lolly-0d72cd.netlify.app'], // Frontend origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     credentials: true, // Allow credentials
// };

// app.use(cors(corsOptions));

// app.use(express.json());

// async function start() {
//     try{
//         const result = await dbConnection.execute("SELECT 'test'")
//         PORT = process.env.PORT || 4000
//         app.listen(PORT , (err)=>{
//         if(err) console.log(err)
//         console.log('succesfully connected to DB')
//         console.log(`Server running on http://localhost:${PORT}`)
//         }
//     )

//     }
//     catch(err){
//         console.log(err)
//     }
// }
// start()

// app.use('/api/user' , userRouter)
// app.use('/api' , questionRouter)
// app.use('/api' , answerRouter)



