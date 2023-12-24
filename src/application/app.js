import express from "express";
import cors from "cors";
import publicUserRouter from "../route/public_api/user.js";
import ErrorMiddleware from "../middleware/error.js";

const app = express();
const cRequestLimit = "100kb";

app.use(
  express.json({
    limit: cRequestLimit,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: cRequestLimit,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET",
  })
);

app.use(publicUserRouter);

app.use(ErrorMiddleware);

app.use("/", (pReq, pRes) => {
  pRes.send("Hello from Genky Portfolio Server!");
});

export default app;
