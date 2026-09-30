import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import router from "./routes";
import { notFound } from "./middlewares/notfound";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Users");
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
