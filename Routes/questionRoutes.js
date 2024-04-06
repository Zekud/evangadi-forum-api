const router = require("express").Router();
const {
  allQuestions,
  singleQuestion,
  ask,
} = require("../Controllers/questionController");

router.get("/allQuestions", allQuestions);
router.get("/singleQuestion", singleQuestion);
router.post("/ask", ask);

module.exports = router;
