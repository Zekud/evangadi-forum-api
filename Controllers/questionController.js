const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const { v4: uuid } = require("uuid");
async function allQuestions(req, res) {
  try {
    const result = await dbConnection.query(
      "SELECT id,questionId,title,tags,userName FROM questions join users on users.userId = questions.userId order by questions.id desc"
    );
    res
      .status(StatusCodes.OK)
      .json({ msg: "Questions fetched successfully", questions: result.rows });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong",
    });
  }
}

async function singleQuestion(req, res) {
  const { id } = req.query;
  try {
    const result = await dbConnection.query(
      "SELECT * FROM questions WHERE questionId = $1",
      [id]
    );
    // if (question.length == 0) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ msg: "Question not found" });
    // }
    return res.status(StatusCodes.OK).json({
      msg: "Question fetched successfully",
      question: result.rows,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong",
    });
  }
}

async function ask(req, res) {
  const { userId, title, description, tags = "" } = req.body;
  const questionId = uuid();
  try {
    await dbConnection.query(
      "insert into questions (questionId,userId,title,description,tags) values ($1,$2,$3,$4,$5)",
      [questionId, userId, title, description, tags]
    );
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong",
    });
  }
}

module.exports = { allQuestions, singleQuestion, ask };
