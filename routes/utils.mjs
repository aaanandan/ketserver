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
    return shuffle(results);
}

export function shuffle(array) {
    array = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}; 
