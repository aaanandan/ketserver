import express from "express";
import { getAllQuestions, getQuestion } from "./utils.mjs";
const router = express.Router();

// Get a all questions from hindu_history
router.get("/", async (req, res) => {
  let results = await getAllQuestions('hindu_history');
  res.send(results).status(200);
});

// Get a single post
router.get("/:id", async (req, res) => {
  let result = await getQuestion(req, 'hindu_history');

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});



export default router;

