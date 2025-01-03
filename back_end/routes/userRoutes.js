const express = require('express');
const authMiddleWare = require('../middleWare/authMiddleWare')


const {login , signUp, checkUser} = require('../controller/userController')
const router = express.Router();

const dbConnection = require('../db/dbConfig');

router.post('/login',  login);
router.post('/signup',  signUp);

router.get('/checkUser', authMiddleWare, checkUser); 

module.exports = router