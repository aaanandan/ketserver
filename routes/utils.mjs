import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

export async function getQuestion(req) {
    let collection = await db.collection(req.body.major);
    let query = { _id: ObjectId(req.body.question._questionId) };
    let result = await collection.findOne(query);
    return result;
}

export async function getAllQuestions(major) {
    let collection = await db.collection(major);
    let results = await collection.find({})
        .toArray();
    return shuffle(results).splice(0, 4);
}

export function shuffle(array) {
    array = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export async function getUserAttempts(req) {
    let response = {
        hinduPhilosophy: await getAttemptCount(req, 'hinduPhilosophy'),
        hinduHistory: await getAttemptCount(req, 'hinduHistory'),
        hinduIdentity: await getAttemptCount(req, 'hinduIdentity'),
        knowYourNation: await getAttemptCount(req, 'knowYourNation')
    }
    console.log(response);
    return response;
}

async function getAttemptCount(req, major) {
    let collection = db.collection('quizUser');
    let query = { email: req.body.email, major };
    let options = { sort: { "index": -1 } };
    let rec = await collection.findOne(query, options).catch(e => console.log(e));
    if (rec) return rec.index;
    return 0;
}

export async function updateUser(req) {
    let collection = db.collection('quizUser');
    let query = { email: req.body.email, major: req.body.major };
    let options = { sort: { "index": -1 } };
    let rec = await collection.findOne(query, options);
    let index = rec ? rec.index + 1 : 1;
    console.log(rec, index);
    let doc = { name: req.body.name || '', email: req.body.email, major: req.body.major, index, response: [{}] };
    await collection.insertOne(doc).then(() => {

        console.log('added new attempt');
    }).catch(e => {
        console.log('e', e);
    });
}


export async function updateUserResponse(req, ans) {
    let collection = db.collection('quizUser');
    let query = { email: req.body.email, major: req.body.major };
    let sort = { sort: { "index": -1 } };
    let question = req.body.question;
    question.correct_answer = ans;
    question.point = question.correct_answer === question.user_answer ? 1 : 0;
    let response = [...req.body.questionsAndAnswers, question];
    // console.log(response);
    // // let rec = await collection.findOneAndUpdate(query, sort, response).then(() => { console.log('updated response') }).catch((e) => {
    // //     console.log(e);
    // // });
}