const express = require('express');
const authMiddleWare = require('../middleWare/authMiddleWare')


const {login , signUp} = require('../controller/userController')
const router = express.Router();

const dbConnection = require('../db/dbConfig');

router.post('/login',  login);

        

router.post('/signup',  signUp);

module.exports = router