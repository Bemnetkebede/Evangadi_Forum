const dbConnection = require('../db/dbConfig')

async function getQuestions(req,res) {
    const allQuestions = ` SELECT 
            q.questionID AS question_id,
            q.title,
            q.description AS content,
            u.username AS user_name, 
            q.createdAt AS created_at

        FROM questionTable q
        JOIN userTable u ON q.userID = u.userID
        ORDER BY q.createdAt DESC `
        try {
            // Await the query result
            const [results] = await dbConnection.query(allQuestions);
    
            if (results.length === 0) {
                return res.status(404).json({
                    message: 'No questions found.',
                });
            }
    
            return res.status(200).json({
                questions: results,
            });
        } catch (err){
            console.error('Database error:', err.message);
            return res.status(500).json({
                message: 'An error occurred while fetching data.',
            });
    }
}

async function getSingleQuestion(req, res) {
    const { questionId } = req.params; // Get question_id from URL parameter

    const singleQuestionQuery = `
        SELECT 
        q.questionID AS questionId,
        q.title,
        q.description AS content,
        q.createdAt AS created_at,
        q.userid AS user_id,
        u2.username AS question_username,
        a.answerid AS answer_id,
        a.answer,
        a.created_at AS answer_created_at,
        u.username AS answer_username
        FROM 
        questionTable q
        LEFT JOIN 
        answerTable a ON q.questionID = a.questionID
        LEFT JOIN 
        userTable u ON u.userid = a.userid
        LEFT JOIN 
        userTable u2 ON u2.userid = q.userid
        WHERE 
        q.questionID = ?
        ORDER BY 
        a.created_at DESC
    `;

    try {
        // Execute the query using the provided question_id
        const [result] = await dbConnection.query(singleQuestionQuery, [questionId]);

        // If no question is found
        if (result.length === 0) {
            return res.status(404).json({
                error: "Not Found",
                message: "The requested question could not be found."
            });
        }

        // Structure the question and its answers
        const question = {
            questionId: result[0].questionId,
            title: result[0].title,
            content: result[0].content,
            created_at: result[0].created_at,
            user_id: result[0].user_id,
            question_username: result[0].question_username,
            answers: result.map(row => ({
                answer_id: row.answer_id,
                answer: row.answer,
                created_at: row.answer_created_at,
                answer_username: row.answer_username
            }))
        };

        // If question is found, return the structured data
        return res.status(200).json({ question });

    } catch (error) {
        // Catch any database or query errors
        console.log(error.message);
        return res.status(500).json({
            error: "Internal Server Error",
            message: "An error occurred while fetching the data."
        });
    }
}

// async function getSingleQuestion(req, res) {
//     const { questionId } = req.params; // Get question_id from URL parameter

//     const singleQuestionQuery = `
//         SELECT 
//         q.questionID AS questionId,
//         q.title,
//         q.description AS content,
//         q.createdAt AS created_at,
//         q.userid AS user_id,
//         u2.username AS question_username,
//         a.answerid AS answer_id,
//         a.answer,
//         a.created_at  AS answer_created_at,
//         u.username AS answer_username
//         FROM 
//         questionTable q
//         LEFT JOIN 
//         answerTable a ON q.questionID = a.questionID
//         LEFT JOIN 
//         userTable u ON u.userid = a.userid
//         LEFT JOIN 
//         userTable u2 ON u2.userid = q.userid
//         WHERE 
//         q.questionID = ?
//         ORDER BY 
//         a.created_at DESC,

//     `,
//     [questionId];

//     try {
//         // Execute the query using the provided question_id
//         const [result] = await dbConnection.query(singleQuestionQuery, [questionId]);

//         // If no question is found
//         if (result.length === 0) {
//             return res.status(404).json({
//                 error: "Not Found",
//                 message: "The requested question could not be found."
//             });
//         }

//         // If question is found, return the first result
//         return res.status(200).json({
//             question: result[0],
//         });

//     } catch (error) {
//         // Catch any database or query errors
//         console.log(error.message);
//         return res.status(500).json({
//             error: "Internal Server Error",
//             message: "An error occurred while fetching the data."
//         });
//     }
// }

async function askQuestion(req, res) {
    // Extract title and description from the request body
    const { title, description, tag, userID } = req.body;

    // Validate if required fields are present
    if (!title || !description) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Please provide all required fields"
        });
    }
            
    // SQL query to insert a new question into the database
    const insertQuestionQuery = `
        INSERT INTO questionTable (userID, title, description, tag)
        VALUES (?, ?, ?, ?);
    `;

    try {
        // Execute the query
        const [result] = await dbConnection.query(insertQuestionQuery, [userID, title, description, tag]);

        // Check if the question was inserted successfully
        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: "Question created successfully"
            });
        } else {
            return res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred while creating the question"
            });
        }

    } catch (error) {
        // Catch any database errors
        console.log(error.message);
        return res.status(500).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred"
        });
    }
}



module.exports ={getQuestions ,getSingleQuestion , askQuestion} 

