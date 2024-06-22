const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "All fields are required" });
  }

  try {
    const result = await dbConnection.query(
      "select userId,userName from users where userName = $1 or email = $2",
      [username, email]
    );
    if (result.rows.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "insert into users (userName, firstName, lastName, email, password) values ($1, $2, $3, $4, $5)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "All fields are required" });
  }

  try {
    const result = await dbConnection.query(
      "select userId,userName,password from users where email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: result.rows[0].userid, userName: result.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login successful", token: token });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
};

const checkUser = (req, res) => {
  const { userId, userName } = req.user;
  res
    .status(StatusCodes.OK)
    .json({ msg: "valid user", userId: userId, userName: userName });
};

module.exports = { register, login, checkUser };
