import express from "express";
import prodRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();
app.use(express.json());
app.use("/products/", prodRouter);
app.use("/users/", userRouter);
app.listen(3000);

//postman documentation 
//https://documenter.getpostman.com/view/29629101/2s9YeLY9hT
