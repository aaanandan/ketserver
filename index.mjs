import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import router from "./routes/majorSubjectQuestions.mjs"

import { auth } from "express-oauth2-jwt-bearer";
import bodyParser from "body-parser";
const PORT = process.env.PORT || 5050;
const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(cors());

//TODO: check can this be removed if body parser is removed?
// app.use(express.json());

//TODO:  add throtell
const jwtCheck = auth({
  audience: 'kerserver.onrender.com',
  issuerBaseURL: 'https://dev-88bircurddzvffqn.us.auth0.com',
  tokenSigningAlg: 'RS256'
});

// enforce on all endpoints
app.use(jwtCheck);
app.use("/", router);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
