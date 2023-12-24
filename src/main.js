import app from "./application/app.js";

const cPort = 3001;

app.listen(cPort, () => {
  console.log(`Server run in port ${cPort}`);
});
