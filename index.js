const express = require('express');
const path = require('path');
const fs = require('fs/promises');
// const { json } = require('express');
// const { Console } = require('console');

const app = express();

app.use(express.json());


const jsonFile = path.resolve('./tasks/gigs.json');
console.log(jsonFile);

app.get('/tasks', async(req, res)=>{
    // console.log('from GET')
    const jsonPath = await fs.readFile(jsonFile, 'utf-8');
    // console.log(jsonPath);
    res.send(jsonPath);
});

app.post('/tasks', async (req, res)=>{
    const determinate = req.body;
    const jsonPath = await fs.readFile(jsonFile, 'utf-8');
    const arrayJson = JSON.parse(jsonPath); 
    const lastIndex = arrayJson.length -1;
    const newId = arrayJson[lastIndex].id +1;
    arrayJson.push({...determinate, id:newId});
    // console.log(arrayJson);
    await fs.writeFile(jsonFile, JSON.stringify(arrayJson));
    res.end();
});

app.put('/tasks', async (req, res)=>{
    const {id, iscomplete} = req.body;
    const jsonPath = await fs.readFile(jsonFile, 'utf-8');
    const arrayJson = JSON.parse(jsonPath);
    const updateJson = arrayJson.findIndex(find => find.id === id);
    if(updateJson>=0){
        arrayJson[updateJson].iscomplete = iscomplete;
    }
    await fs.writeFile(jsonFile, JSON.stringify(arrayJson));
    // console.log(putArray);
    res.end();
    // console.log(updateJson);
});

app.delete('/tasks', async (req, res)=>{
    const {id} = req.body;
    const arrayJson = JSON.parse(await fs.readFile(jsonFile, 'utf-8'));
    const deleteThis = arrayJson.findIndex(find => find.id === id);
    arrayJson.splice(deleteThis, 1);
    await fs.writeFile(jsonFile, JSON.stringify(arrayJson));
    res.send('deleted task');    
})

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`working right on ${PORT}`)
});