import { query } from "../database.js";
import express from "express";
import { checkAuthAndID, throwErr, handleError } from "./prodHelper.js";

const getAllProducts = async (req, res) => {
  query.execute("SELECT * FROM products", (err, products) => {
    if (err) {
      res.status(500).json({
        status: "Error",
        message: err.message,
      });
    } else {
      res.status(200).json({
        status: "Success",
        products,
      });
    }
  });
};

//

const createProduct = async (req, res) => {
  const { pName, pDescription, price, createdby } = req.body;

  const queryText =
    "INSERT INTO products (pName, pDescription, price, createdby) VALUES (?, ?, ?, ?)";
  query.execute(
    queryText,
    [pName, pDescription, price, createdby],
    (err, data) => {
      if (err) {
        res.status(500).json({
          status: "Error",
          message: err.message,
        });
      } else {
        const product = { pName, pDescription, price, createdby };
        res.status(200).json({
          status: "Success",
          message: "Product Created",
          product,
        });
      }
    }
  );
};

//

const updateProduct = async (req, res) => {
  const id = req.params.id * 1;
  const user = req.params.user * 1;

  const { pName, pDescription, price, createdby } = req.body;

  let queryText = [];

  if (pName) {
    queryText.push(`pName ="${pName}"`);
  }

  if (pDescription) {
    queryText.push(`pDescription ="${pDescription}"`);
  }

  if (price) {
    queryText.push(`price ="${price}"`);
  }

  if (createdby) {
    queryText.push(`createdby ="${createdby}"`);
  }

  const flag = await checkAuthAndID(res, user, id).catch((error) => {
    throwErr(error, res);
  });

  //

  if (!flag) return;

  query.execute(
    `UPDATE products SET ${queryText.join(",")} WHERE id= ${id}`,
    (err, data) => {
      console.log(`UPDATE products SET ${queryText.join(",")} WHERE id= ${id}`);

      if (err) {
        // handleError(res, 500);
        res.json({
          err: err.message,
        });
      }

      //
      else {
        res.status(200).json({
          status: "Success",
          message: "Product Updated",
        });
      }
    }
  );
};

//

const deleteProduct = async (req, res) => {
  const id = req.params.id * 1;
  const user = req.params.user * 1;

  const flag = await checkAuthAndID(res, user, id).catch((err) =>
    throwErr(err, res)
  );
  if (!flag) return;

  query.execute(`DELETE FROM products WHERE id= ${id}`, (err, data) => {
    if (err) {
      handleError(res, 500);
    } else {
      res.status(200).json({
        status: "Success",
        message: "Product Deleted",
      });
    }
  });
};

//

const getProduct = async (req, res) => {
  const id = req.params.id * 1;
  const user = req.params.user * 1;

  const flag = await checkAuthAndID(res, user, id).catch((err) =>
    throwErr(err, res)
  );

  if (!flag) return;

  query.execute(`SELECT * FROM products WHERE id = ${id}`, (err, product) => {
    if (err) {
      handleError(res, 500);
    } else {
      res.status(200).json({
        status: "Success",
        product,
      });
    }
  });
};

//search based on variable price
const searchProducts = (req, res) => {
  const price = req.params.price * 1;

  query.execute(
    `SELECT * FROM products WHERE price > ${price} `,
    (err, products) => {
      if (err) {
        res.status(500).json({
          status: "Error",
          message: err.message,
        });
      } else if (!products.length) {
        res.status(200).json({
          status: "Failed",
          message: "No products found",
        });
      } else {
        res.status(200).json({
          status: "Success",
          products,
        });
      }
    }
  );
};

export {
  getAllProducts,
  getProduct,
  deleteProduct,
  searchProducts,
  createProduct,
  updateProduct,
};
