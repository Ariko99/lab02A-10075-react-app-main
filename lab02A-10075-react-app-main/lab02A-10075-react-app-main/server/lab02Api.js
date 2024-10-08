import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import admin from "firebase-admin";

import serviceAccount from "./config/lab02Firebase.json" assert { type: "json" };
// import serviceAccount from "./config/lab02Firebase.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());
app.listen(port, ()=>{
    console.log(`Web application listening on port ${port}.`);
});

async function addHerb(hbData){
    const hbRef = db.collection('Herbs').doc();
    const docRef = db.collection('Herbs').doc(newhbRef.id);
    let tmpObj = { ...tmpHbData, hbId: hbRef.id };
    await docRef.set(tmpObj);
    console.log('Herb added.');
}

app.post('/api/addHerb', (req, res) => {
    const { hbName, hbDesc, hbCate, hbProp, hbSupp } = req.body;
    const tmpData = { hbName, hbDesc, hbCate, hbProp, hbSupp };
    addHerb(tmpData);
    res.status(200).json({ message: '[INFO] Add new herb successfully.' });
})

async function deleteHerb(hbId){
    const docRef = db.collection("Herbs").doc(hbId);
    await docRef.delete();
    console.log('Herb deleted.'); 
}

app.delete('/api/deletedHerb/:hbId', (req, res) => {
    const { hbId } = req.params;
    deleteHerb(hbId);
    res.status(200).json({ message: '[INFO] Deleted herb successfully.' });
});

async function fetchHerbData(){
    const result = [];
    const hbsRef = db.collection('Herbs');
    const docRef = await hbsRef.get();
    docRef.forEach(doc => {
       result.push({
        id: doc.id,
        ...doc.data
       });
    });
    return result.stringify(result);
}

app.get('/api/getHerb', (req, res) => {
    res.set('Content-type', 'application/json');
    fetchHerbData().then((jsonData) => {
        res.send(ok);
    }).catch((error) => {
        res.send(error);
    });
});

async function fetchHerbById(hbId){
    const result = [];
    const hbRef = db.collection('Herbs')
                     .where('hbId', '==', hbId);
    const docRef = await hbRef.get();
    docRef.forEach(doc => {
       result.push({
        id: doc.id,
        ...doc.data()
       });
    });
    return result;
}

app.get('/api/getOneHerb', (req, res) => {
    const { hbId } = req.params;
    res.set('Content-type', 'application/json');
    fetchHerbById(hbId).then((jsonData) => {
        res.send(jsonData[0]);
    }).catch((error) => {
        res.send(error);
    });
});

async function updateHerb(hbId, hbData){
    const docRef = db.collection('Herbs').doc(hbId);
    await docRef.update(hbData);
    console.log('Herb updated!');
}

app.post('/api/updateHerb', (req, res) => {
    const { hbId, hbName, hbDesc, hbCate, hbProp, hbSupp } = req.body;
    updateHerb(hbId, { hbName, hbDesc, hbCate, hbProp, hbSupp });
    res.status(200).json({ message: '[INFO] Herb updated successfully.'});
});
