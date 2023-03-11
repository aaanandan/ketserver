import express from "express";
import { getAllQuestions, getQuestion } from "./utils.mjs";
const router = express.Router();
let results = null;
// Get a all questions from hindu_history
router.post("/getQuestions", async (req, res) => {
  results = await getAllQuestions(req.body.major);
  let questions = results.map(res => { delete res.correct_answer; return res; })
  res.send(questions).status(200);
});
1
// Get a single ans
router.post("/validateAnswer", async (req, res) => {
  // if (!results) results = await getAllQuestions('hindu_history');
  // let answer = results.find(ele => ele._id === req.params._id);
  let result = await getQuestion(req);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;