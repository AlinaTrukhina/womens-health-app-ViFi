const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', async (req, res) => {
  // Get comments and ratings from user feedback form
  let commentsAndRatingsSqlText = `
    SELECT "feedback"."id", "feedback"."comment", "feedback"."rating" FROM "feedback";
    `;
  //Get questions and answers from user feedback form
  let questionAndAnswerSqlText = `
    SELECT "feedback_q"."question", json_agg(("feedback_q"."answer")) FROM "feedback_q"
    GROUP BY "feedback_q"."question"
    LIMIT 20;
    `;
  //Get count of the feedback answers from user feedback form
  let answerCountSqlText = `
    SELECT "question", "answer", count("answer") from "feedback_q" group by "question", "answer"
    LIMIT 20;
    `;

  try {

    //Get comments and ratings response
    let commentsAndRatingsRes = await pool.query(commentsAndRatingsSqlText);
    console.log('comments and ratings res is', commentsAndRatingsRes);

    //Get questions and answers response
    let questionAndAnswerRes = await pool.query(questionAndAnswerSqlText);
    console.log('question and answer res is', questionAndAnswerRes);

    //get answer counts response
    let answerCountRes = await pool.query(answerCountSqlText);
    console.log('answerCount res is', answerCountRes);

    let apiRes = {
      commentsAndRatings: commentsAndRatingsRes.rows,
      questionsAndAnswers: questionAndAnswerRes.rows,
      answerCountRes: answerCountRes.rows,

    }
    res.send(apiRes);

  } catch (err) {
    console.log('Error with fetching comments, ratings, questions, and answers', err);
    res.sendStatus(500);
  }
})


router.get('/avg', (req, res) => { // GET AVERAGE OF ALL RATINGS
  pool.query(`
    SELECT AVG("rating") as average_rating FROM "feedback";
  `)
    .then(dbRes => {
      res.send(dbRes.rows);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
})

router.post('/', async (req, res) => {

  const client = await pool.connect();
  const questions = req.body.questions;
  const answers = req.body.answers;

  try {
    await client.query('BEGIN'); // start database stream

    const newFeedbackID = await client.query(`
      INSERT INTO "feedback" ("comment", "rating")
      VALUES ($1, $2) RETURNING "id";
    `, [req.body.comment, req.body.rating]);

    await Promise.all(questions.map(async (question, i) => {
      await client.query(`
        INSERT INTO "feedback_q" ("question", "answer", "feedback_id")
        VALUES ($1, $2, $3);
      `, [question, answers[i + 1], newFeedbackID.rows[0].id]);
    }));

    await client.query('COMMIT'); // if everything is as required
    res.sendStatus(201);

  } catch (err) {

    await client.query('ROLLBACK'); // if something is missing
    console.log('Unable to complete survey entry :: ', err);
    res.sendStatus(500);

  } finally {
    client.release(); // stop the database stream
  }
});

router.delete('/', (req, res) => { // DELETE FEEDBACK
  pool.query(`
    DELETE FROM "feedback" WHERE "id" = $1;
  `, [req.body.id])
    .then(dbRes => {
      console.log('---- Deleted feedback row : ', req.body.id);
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    })
})

module.exports = router;
