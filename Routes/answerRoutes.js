const { allAnswers, postAnswer } = require("../Controllers/answerController");
const router = require("express").Router();

router.get("/allAnswers", allAnswers);
router.post("/postAnswer", postAnswer);

module.exports = router;
