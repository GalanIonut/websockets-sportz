import express from "express";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the Express.js server!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
