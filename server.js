const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
// Data pora
function getData(){
  return JSON.parse(fs.readFileSync('data.json','utf-8'));
}
function saveData(data){
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// Sob email ana
app.get('/emails', (req,res)=>{
  const data = getData();
  res.json(data.emails);
});

// Notun email pathano / save kora
app.post('/emails', (req,res)=>{
  const data = getData();
  const newEmail = { id: Date.now(), ...req.body };
  data.emails.push(newEmail);
  saveData(data);
  res.json(newEmail);
});

app.listen(4000, ()=> console.log('Server running on port 4000'));