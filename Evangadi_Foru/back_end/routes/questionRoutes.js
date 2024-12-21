const express = require('express')
const dbConnection = require('../db/dbConfig')
const router = express.Router();
const {getQuestions ,getSingleQuestion , askQuestion } = require('../controller/questionControl')
const authMiddleWare = require('../middleWare/authMiddleWare')


router.get('/question' ,authMiddleWare, getQuestions)
router.get('/getSingleQuestion/:question_id', authMiddleWare, getSingleQuestion)
router.post('/askQuestion' ,authMiddleWare, askQuestion)


module.exports = router
