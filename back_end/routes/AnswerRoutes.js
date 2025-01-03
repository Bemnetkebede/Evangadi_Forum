const express = require('express')
const router = express.Router();
const { getAnswersForQuestion , giveAnswer } = require('../controller/AnswerControl')
const authMiddleWare = require('../middleWare/authMiddleWare')

router.get('/answer/:question_id',authMiddleWare ,getAnswersForQuestion)

router.post('/giveAnswer', giveAnswer);

module.exports = router