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
    let mcq = await collection.find({ type: "mcq" })
        .toArray();
    let applications = await collection.find({ type: "application" })
        .toArray();
    let activity = await collection.find({ type: "activity" })
        .toArray();
    const mcqQuestions = shuffle(mcq).splice(0, 25);
    const applicationQuestions = shuffle(applications).splice(0, 5);
    const activitesQuestions = shuffle(activity).splice(0, 1);
    return [...mcqQuestions, ...applicationQuestions, ...activitesQuestions];
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

export async function addAttempt(req) {
    let collection = db.collection('quizUser');
    let query = { email: req.body.email, major: req.body.major };
    let options = { sort: { "index": -1 } };
    let rec = await collection.findOne(query, options);
    let index = rec ? rec.index + 1 : 1;
    // console.log(rec, index);
    let doc = { name: req.body.name || '', email: req.body.email, major: req.body.major, index, createdAt: Date(), response: [{}] };
    await collection.insertOne(doc).then(() => {
        console.log('added new attempt');
    }).catch(e => {
        console.log('e', e);
    });
}


export async function updateUserResponse(req, ans) {
    let collection = db.collection('quizUser');
    let query = { email: req.body.email, major: req.body.major };

    let question = req.body.question;
    question.correct_answer = ans;
    question.point = question.correct_answer === question.user_answer ? 1 : 0;
    let response = [...req.body.questionsAndAnswers, question];
    await collection.updateOne(query, { $set: { response: response }, $currentDate: { lastModified: true } }).then(() => { console.log('updated response') }).catch((e) => {
        console.log(e);
    });

}