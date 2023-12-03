import express from "express";
import cors from "cors";

const cApp = express();
const cPort = 3001;
const cRequestLimit = "100kb";

cApp.use(
  express.json({
    limit: cRequestLimit,
  })
);

cApp.use(
  express.urlencoded({
    extended: true,
    limit: cRequestLimit,
  })
);

cApp.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET",
  })
);

cApp.listen(cPort, () => {
  console.log(`Server start in port ${cPort}`);
});
