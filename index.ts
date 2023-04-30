import express from "express";
import dotenv from "dotenv";
import { cors } from "./cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error-middleware";
import api from "./api";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10gb" }));
app.use(cors);
app.use(cookieParser());
app.use("/api", api);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App started with PORT ${PORT}`);
})
