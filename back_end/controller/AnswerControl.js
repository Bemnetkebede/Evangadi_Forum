const dbConnection = require('../db/dbConfig')

async function getAnswersForQuestion(req , res) {
    const { question_id } = req.params

    if (!question_id || isNaN(question_id)) {
        return res.status(400).json({ 
            error: 'Bad Request', 
            message: 'Invalid question_id.' 
        });
    }
    try {
        const query = `
            SELECT 
                a.id AS answer_id, 
                a.content, 
                u.name AS user_name, 
                a.created_at 
            FROM answers a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.question_id = ?`;

        const [answers] = await dbConnection.query(query, [question_id]);

        if (!answers.length) {
            return res.status(404).json({ 
                error: 'Not Found', 
                message: 'The requested question could not be found.' 
            });
        }

        res.status(200).json({ answers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: 'An unexpected error occurred.' 
        });
    }
}

async function giveAnswer(req, res) {
    const { questionID, userID, answer } = req.body;

    // Validate input
    if (!questionID || !userID || !answer) {
        return res.status(400).json({
            message: 'Missing required fields: questionID, userID, and answer are required.',
        });
    }

    // Verify the question exists
    const checkQuestionQuery = `SELECT * FROM questionTable WHERE questionID = ?`;
    dbConnection.query(checkQuestionQuery, [questionID], (err, results) => {
        if (err) {
            console.error('Error checking question existence:', err);
            return res.status(500).json({ message: 'Database error while checking question.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        // Insert the answer into the answerTable
        const insertAnswerQuery = `
            INSERT INTO answerTable (questionID, userID, answer)
            VALUES (?, ?, ?)
        `;
        dbConnection.query(insertAnswerQuery, [questionID, userID, answer], (err, results) => {
            if (err) {
                console.error('Error inserting answer:', err);
                return res.status(500).json({ message: 'Database error while inserting answer.' });
            }

            // Respond with the created answer ID
            return res.status(201).json({
                message: 'Answer created successfully.',
                answerID: results.insertId,
            });
        });
    });


}

module.exports = { getAnswersForQuestion , giveAnswer};
