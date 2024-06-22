const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

async function allAnswers(req, res) {
  const { id } = req.query;
  try {
    const result = await dbConnection.query(
      `SELECT userName,answer FROM answers join users on users.userId = answers.userId WHERE questionId = $1 order by answers.answerId desc`,
      [id]
    );
    res.status(StatusCodes.OK).json({
      msg: "Answers fetched successfully",
      answers: result.rows,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong",
    });
  }
}

async function postAnswer(req, res) {
  const { userId, questionId, answer } = req.body;
  try {
    await dbConnection.query(
      `insert into answers (userId,questionId,answer) values ($1,$2,$3)`,
      [userId, questionId, answer]
    );
    const result = await dbConnection.query(
      `SELECT userName,answer FROM answers join users on users.userId = answers.userId WHERE questionId = $1 order by answers.answerId desc`,
      [questionId]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully", answers: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong",
    });
  }
}

module.exports = { allAnswers, postAnswer };
