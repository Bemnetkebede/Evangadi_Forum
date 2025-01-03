// const express = require('express')
// const dbConnection = require('../db/dbConfig')
// const router = express.Router();
// const {getQuestions ,getSingleQuestion , askQuestion } = require('../controller/questionControl')
// const authMiddleWare = require('../middleWare/authMiddleWare')


// router.get('/question' ,authMiddleWare, getQuestions)
// router.get('/getSingleQuestion/:question_id', authMiddleWare, getSingleQuestion)
// router.post('/askQuestion' ,authMiddleWare, askQuestion)


// module.exports = router

const express = require("express");
const router = express.Router();
const authMiddleWare = require('../middleWare/authMiddleWare')


const {getQuestions ,getSingleQuestion , askQuestion } = require('../controller/questionControl')

// get all questions
router.get("/question" , getQuestions);


// get single question
router.get("/question/:questionId",authMiddleWare, getSingleQuestion);

// post a question
router.post("/askQuestion", askQuestion);


module.exports = router;
