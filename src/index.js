import express from "express";
import { matchRouter } from "./routes/matches.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Sportz API!");
});

app.use("/matches", matchRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
