import express from "express";
import { getAllQuestions, getQuestion, addAttempt, updateUserResponse, getUserAttempts } from "./utils.mjs";
const router = express.Router();
let results = null;
// Get a all questions from hindu_history
router.post("/getQuestions", async (req, res) => {
  await addAttempt(req);
  results = await getAllQuestions(req.body.major);

  let questions = results.map(res => { delete res.correct_answer; return res; })
  res.send(questions).status(200);
});
1
// Get a single ans
router.post("/validateAnswer", async (req, res) => {
  let result = await getQuestion(req);
  await updateUserResponse(req, result.correct_answer);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.post('/attempts', async (req, res) => {
  // let result = await getQuestion(req);
  let result = await getUserAttempts(req);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);

})

export default router;