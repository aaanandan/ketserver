import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

export async function getQuestion(req, major) {
    let collection = await db.collection(major);
    let query = { _id: ObjectId(req.params.id) };
    let result = await collection.findOne(query);
    return result;
}

export async function getAllQuestions(major) {
    let collection = await db.collection(major);
    let results = await collection.find({})
        .limit(5)
        .toArray();
    return results;
}
