const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// GET router to fetch health categories database
router.get('/', rejectUnauthenticated, function (req, res) {

  let sqlText = `SELECT * FROM "health_category";`;

  pool.query(sqlText)

    .then(dbRes => {
      res.send(dbRes.rows);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    })
});

//GET router to fetch screening information based on category id and age range id
router.get('/:catId/ages/:ageId', rejectUnauthenticated, async (req, res) => {

  let faqSQLText = `
    SELECT ("question"), ("answer"), ("id") FROM "faq"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

  let diagSQLText = `SELECT ("name"), ("info"), ("id") FROM "diagnostic_tool"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

  let guidelinesSQLText = `SELECT name, info, grade, to_char(date,'MM/DD/YYYY') as date, id FROM guidelines WHERE health_category_id = $1 AND age_range_id=$2;`;


  let drQuestionsSQLText = `SELECT ("question_category"), ("question"), ("id") FROM "doctor_questions"
    WHERE "health_category_id" = $1 AND "age_range_id"=$2;`;

  // Get category details
  try {

    //Get FAQs  
    let faqRes = await pool.query(faqSQLText, [req.params.catId, req.params.ageId]);

    //Get diagnostic tools
    let diagRes = await pool.query(diagSQLText, [req.params.catId, req.params.ageId]);

    //Get guidelines
    let guidelinesRes = await pool.query(guidelinesSQLText, [req.params.catId, req.params.ageId]);

    //Get questions to ask your doctor
    let drQuestionsRes = await pool.query(drQuestionsSQLText, [req.params.catId, req.params.ageId]);

    let apiRes = {
      faqs: faqRes.rows,
      diagTools: diagRes.rows,
      guidelines: guidelinesRes.rows,
      drQuestions: drQuestionsRes.rows,
    }
    res.send(apiRes);

  } catch (err) {
    console.error('Error with fetching category details', err);
    res.sendStatus(500);
  }
})

// GET route gets detailed view for one health category, based on the category selected
router.get('/:catId/ages/:ageId/:sectionName', rejectUnauthenticated, async (req, res) => {

  const sectionName = req.params.sectionName;

  let sqlParams = [req.params.catId, req.params.ageId];
  let sqlText = '';

  switch (sectionName) {
    case 'Guidelines':
      sqlText = `SELECT "id", "name" AS "field01",
        "info" AS "field02", 
        "grade" AS "field03", to_char(date, 'YYYY-MM-DD') AS "field04" 
        FROM "guidelines"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2
        ORDER BY "id" ASC ;`;
      break;
    case 'Diagnostic Tools':
      sqlText = `SELECT "id", "name" AS "field01", "info" AS "field02" 
        FROM "diagnostic_tool"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2
        ORDER BY "id" ASC
        ;`;
      break;
    case 'FAQ':
      sqlText = `
        SELECT "id", "question" AS "field01", "answer" AS "field02" 
        FROM "faq"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2
        ORDER BY "id" ASC
        ;`;
      break;
    case 'Questions for Your Doctor':
      sqlText = `SELECT "id", "question_category" AS "field01", "question" AS "field02"
        FROM "doctor_questions"
        WHERE "health_category_id" = $1 AND "age_range_id"=$2
        ORDER BY "id" ASC;`;
      break;
  }

  // Get category details
  try {

    let dbRes = await pool.query(sqlText, sqlParams);

    res.send(dbRes.rows);

  } catch (err) {
      console.error('Error with fetching category details', err);
      res.sendStatus(500);
  }
})

// PUT router, edits the selected line in a specific health category table, 
// based on age range, health category, and id of the line selected by admin
router.put('/:catId/ages/:ageId/:sectionName', rejectUnauthenticated, (req, res) => {

  const sectionName = req.params.sectionName;

  // set sqlParams; they may change in the switch statement based on which section name was selected
  let sqlParams = [req.body.id, req.params.catId, req.params.ageId, 
    req.body.field01, req.body.field02];
  let sqlText = '';

  // switch statement to determine which table to update
  switch (sectionName) {
    case 'Guidelines':
      sqlText = `
        UPDATE "guidelines" 
        SET "name" = $4 , "info" = $5, "grade" = $6, "date" = $7
        WHERE "id" = $1 AND "health_category_id" = $2 AND "age_range_id" = $3;`;
      sqlParams = [req.body.id, req.params.catId, req.params.ageId,
      req.body.field01, req.body.field02, req.body.field03, req.body.field04];

      break;
    case 'Diagnostic Tools':
      sqlText = `
        UPDATE "diagnostic_tool"
        SET "name" = $4 , "info" = $5
        WHERE "id" = $1 AND "health_category_id" = $2 AND "age_range_id" = $3;`;
      break;
    case 'FAQ':
      sqlText = `
        UPDATE "faq"
        SET "question" = $4 , "answer" = $5
        WHERE "id" = $1 AND "health_category_id" = $2 AND "age_range_id" = $3;`;
      break;
    case 'Questions for Your Doctor':
      sqlText = `
        UPDATE "doctor_questions"
        SET "question" = $5 , "question_category" = $4
        WHERE "id" = $1 AND "health_category_id" = $2 AND "age_range_id" = $3;`;
      break;
    case 'Resources':
      sqlText = `
        UPDATE "resources"
        SET "name" = $1 , "link" = $2 , "description" = $3 
        WHERE "id" = $4 AND "health_category_id" = $5
      ;
      `;
      sqlParams = [req.body.name, req.body.link, req.body.description, req.body.id, catId];
      break;
  }

  pool.query(sqlText, sqlParams)
  .then(dbRes => {
    res.sendStatus(204);
  })
  .catch(error => {
    console.error(error);
    res.sendStatus(500);
  })
});


// POST router, adds the selected line in a specific health category table, 
// based on age range, health category, and id of the line selected by admin
router.post('/:catId/ages/:ageId/:sectionName', rejectUnauthenticated, (req, res) => {

  const catId = req.params.catId;
  const ageId = req.params.ageId;
  const sectionName = req.params.sectionName;

  // set sqlParams; they may change in the switch statement based on which section name was selected
  let sqlParams = [req.body.field01, req.body.field02, req.params.catId, req.params.ageId];
  let sqlText = '';

  // switch statement to determine which table to update
  switch (sectionName) {
    case 'Guidelines':
      sqlText = `
        INSERT INTO "guidelines" ("name", "info", "health_category_id", "age_range_id", "grade", "date")
        VALUES ($1, $2, $3, $4, $5, $6);`;
      sqlParams = [req.body.field01, req.body.field02, catId, ageId, req.body.field03, req.body.field04];

      break;
    case 'Diagnostic Tools':
      sqlText = `
        INSERT INTO "diagnostic_tool" ("name", "info", "health_category_id", "age_range_id")
        VALUES ($1, $2, $3, $4);`;
      break;
    case 'FAQ':
      sqlText = `
        INSERT INTO "faq" ("question", "answer", "health_category_id", "age_range_id")
        VALUES ($1, $2, $3, $4);`;
      break;
    case 'Questions for Your Doctor':
      sqlText = `
        INSERT INTO "doctor_questions" ("question_category", "question", "health_category_id", "age_range_id")
        VALUES ($1, $2, $3, $4);`;
      break;
    case 'Resources':
      sqlText = `
      INSERT INTO "resources" ("name", "link", "description", "health_category_id")
      VALUES ($1 , $2 , $3, $4 )
      ;
      `;
      sqlParams = [req.body.field01, req.body.field02, req.body.field03, req.body.id, catId];
      break;
  }

  pool.query(sqlText, sqlParams)
  .then(dbRes => {
    res.sendStatus(201);
  })
  .catch(error => {
    console.error(error);
    res.sendStatus(500);
  })
});

// DELETE router, deletes the selected line in a specific health category table, 
// based on age range, health category, and id of the line selected by admin
router.delete('/:catId/ages/:ageId/:sectionName', rejectUnauthenticated, (req, res) => {
  
  const ageId = req.body.ageId;
  const catId = req.body.catId;
  const sectionName = req.params.sectionName;

  let sqlParams = [req.body.id];
  let sqlText = '';

  // switch statement to determine which table to delete from
  switch (sectionName) {
    case 'Guidelines':
      sqlText = `
          DELETE FROM "guidelines" 
          WHERE "id" = $1;`;
      break;
    case 'Diagnostic Tools':
      sqlText = `
          DELETE FROM "diagnostic_tool" 
          WHERE "id" = $1;`;
      break;
    case 'FAQ':
      sqlText = `
          DELETE FROM "faq" 
          WHERE "id" = $1;`;
      break;
    case 'Questions for Your Doctor':
      sqlText = `
          DELETE FROM "doctor_questions" 
          WHERE "id" = $1;`;
      break;
    case 'Resources':
      sqlText = `
          DELETE FROM "resources"
          WHERE "id" = $1
        ;
        `;
      break;
    }
  
    pool.query(sqlText, sqlParams)
  .then(dbRes => {
    res.sendStatus(204);
  })
  .catch(error => {
    console.error(error);
    res.sendStatus(500);
  })
});

module.exports = router;

