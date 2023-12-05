import express from "express";
import { query } from "../database.js";

const app = express();
app.use(express.json());

const throwErr = (err, res) => {
  if (err.message == "Invalid ID") {
    res.status(400).json({
      status: "Error",
      message: "Invalid ID",
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
  return false;
};

const checkID = async (id) => {
  return new Promise((resolve, reject) => {
    query.execute(`SELECT COUNT(*) as count FROM users`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (id > data[0].count) reject(new Error("Invalid ID"));
        resolve(true);
      }
    });
  });
};

//

const checkIDExist = async (id) => {
  return new Promise((resolve, reject) => {
    query.execute(`SELECT * FROM users where id = ${id} `, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (!data.length) reject(new Error("Invalid ID"));
        resolve(true);
      }
    });
  });
};

const getAllUsers = (req, res) => {
  query.execute("SELECT * FROM users", (err, users) => {
    if (err) {
      res.status(500).json({
        status: "Error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        status: "Success",
        users,
      });
    }
  });
};

const createUser = async (req, res) => {
  const { name, age, email, password } = req.body;
  if (name.length < 3 || password.length < 3) {
    res.status(400).json({
      status: "Error",
      message: "Name and password must be greater than 2 characters",
    });
    return false;
  }

  const queryText =
    "INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)";
  const values = [name || null, age || null, email || null, password || null];

  query.execute(queryText, values, (err, data) => {
    if (err) {
      res.status(500).json({
        status: "Error",
        message: "Internal Server Error",
        err,
      });
    } else {
      const user = { name, age, email, password };
      res.status(200).json({
        status: "Success",
        message: "User Created",
        user,
      });
    }
  });
};

const updateUser = async (req, res) => {
  const id = req.params.id * 1;

  const { name, age, email, password } = req.body;
  const updatedFields = [];

  if (name) {
    updatedFields.push(`name="${name}"`);
  }
  if (age) {
    updatedFields.push(`age=${age}`);
  }
  if (email) {
    updatedFields.push(`email ="${email}"`);
  }
  if (password) {
    updatedFields.push(`password="${password}"`);
  }

  if (updatedFields.length === 0) {
    res.status(400).json({
      status: "Error",
      message: "No fields to update",
    });
  }

  const flag = await checkID(id).catch((err) => throwErr(err, res));
  if (!flag) return;

  query.execute(
    `UPDATE users SET ${updatedFields.join(",")} WHERE id = ${id}`,
    (err, data) => {
      console.log(
        `UPDATE users SET ${updatedFields.join(",")} WHERE id = ${id}`
      );
      if (err) {
        res.status(500).json({
          status: "Error",
          message: err.message,
        });
      } else {
        res.status(200).json({
          status: "Success",
          message: "User Updated",
        });
      }
    }
  );
};

const deleteUser = async (req, res) => {
  const id = req.params.id * 1;

  const flag = await checkIDExist(id).catch((err) => throwErr(err, res));
  if (!flag) return;

  query.execute(`DELETE FROM users WHERE id = ${id}`, (err, data) => {
    if (err) {
      res.status(500).json({
        status: "Error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        status: "Success",
        message: "User Deleted",
      });
    }
  });
};

//4- search for user where his name start with "a" and age less than 30 => using like for characters
const searchUsers = (req, res) => {
  const letter = req.params.letter[0];
  const age = req.params.age * 1;

  query.execute(
    `SELECT * FROM users WHERE name LIKE '${letter}%' AND age < ${age}`,
    (err, users) => {
      if (err) {
        res.status(500).json({
          status: "Error",
          message: "Internal Server Error",
        });
      } else if (!users.length) {
        res.status(200).json({
          status: "Failed",
          message: "No users found",
        });
      } else {
        res.status(200).json({
          status: "Success",
          users,
        });
      }
    }
  );
};

//5- search for users by list of ids => using IN
const searchByIDS = (req, res) => {
  const ids = req.params.ids.split(",").map(Number);
  const text = ids.map(() => "?").join(",");
  query.execute(
    `SELECT * FROM users where id IN (${text})`,
    ids,
    (err, data) => {
      if (err) {
        res.status(500).json({
          status: "Error",
          message: "Internal Server Error",
        });
      } else if (!data.length) {
        res.status(200).json({
          status: "Failed",
          message: "No users found",
        });
      } else {
        res.status(200).json({
          status: "Success",
          users: data,
        });
      }
    }
  );
};

const getUsersWitProducts = (req, res) => {
  query.execute(
    "SELECT createdby AS user_id, products.id AS product_id  ,name,email,age FROM users LEFT JOIN products on users.id=products.createdby",
    (err, data) => {
      if (err) {
        res.status(500).json({
          status: "Error",
          message: "Internal Server Error",
        });
      } else if (!data.length) {
        res.status(200).json({
          status: "Failed",
          message: "No users found",
        });
      } else {
        res.status(200).json({
          status: "Success",
          users: data,
        });
      }
    }
  );
};

export {
  getAllUsers,
  getUsersWitProducts,
  createUser,
  deleteUser,
  updateUser,
  searchByIDS,
  searchUsers,
};
