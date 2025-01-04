const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
const questionRouter = require('./routes/questionRoutes')
const answerRouter = require('./routes/AnswerRoutes')

const dbConnection = require('./db/dbConfig')


const app = express()
app.use(cors())
app.use(express.json());

async function start() {
    try{
        const result = await dbConnection.execute("SELECT 'test'")
        PORT = process.env.PORT || 4000
        app.listen(PORT , (err)=>{
        if(err) console.log(err)
        console.log('succesfully connected to DB')
        console.log(`Server running on http://localhost:${PORT}`)
        }
    )

    }
    catch(err){
        console.log(err)
    }
}
start()

app.use('/api/user' , userRouter)
app.use('/api' , questionRouter)
app.use('/api' , answerRouter)



