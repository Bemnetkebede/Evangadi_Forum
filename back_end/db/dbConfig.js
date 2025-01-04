const mysql = require('mysql2');
require('dotenv').config();

// const UserTable = `
// CREATE TABLE IF NOT EXISTS userTable (
//     userID INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     firstName VARCHAR(50) NOT NULL ,
//     LastName VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL
// );`;

// const QuestionTable = `
// CREATE TABLE IF NOT EXISTS questionTable (
//     questionID INT AUTO_INCREMENT PRIMARY KEY,
//     userID INT NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     tag VARCHAR(255),
//     description VARCHAR(255) NOT NULL,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (userID) REFERENCES userTable(userID)
// );`;

// const AnswerTable = `
// CREATE TABLE IF NOT EXISTS answerTable (
//     answerID INT AUTO_INCREMENT PRIMARY KEY,
//     questionID INT NOT NULL,
//     userID INT NOT NULL,
//     answer TEXT NOT NULL,
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (questionID) REFERENCES questionTable(questionID) ON DELETE CASCADE,
//     FOREIGN KEY (userID) REFERENCES userTable(userID) ON DELETE CASCADE
// );`;



const dbConnection = mysql.createConnection({
    host :process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER, 
    database :process.env.MYSQL_ADDON_DB,
    password : process.env.MYSQL_ADDON_PASSWORD
})



module.exports = dbConnection.promise()
