import { query } from "../database.js";
export const handleError = (res) => {
  res.status(500).json({
    status: "Error",
    message: "Internal Server Error",
  });
};

export const throwErr = (error, res) => {
  if (error.message === "Product not found") {
    res.status(404).json({
      status: "Error",
      message: "Product not found",
    });
  }
  //
  else if (error.message === "Authorization error") {
    res.status(400).json({
      status: "Error",
      message: "You are not authorized to update this product",
    });
  } else {
    res.json({
      status: "Error",
      message: error.message,
    });
  }
  return false;
};

export const checkAuthAndID = async (res, user, id) => {
  return new Promise((resolve, reject) => {
    query.execute(
      `SELECT createdby FROM products WHERE id = ${id}`,
      (err, data) => {
        if (err) {
          reject(err);
        } else if (!data.length) {
          reject(new Error("Product not found"));
        } else if (isNaN(user) || data[0].createdby !== user) {
          reject(new Error("Authorization error"));
        } else {
          resolve(true);
        }
      }
    );
  });
};
