const express =require('express');
const path = require('path');
const {v4}= require('uuid');
const app =express();

//instaed DB will use this array
let CONTACTS = [

    //will move here model from the frontend array
    {id:v4(),name:"Example server contact",value:"0546-426-242",marked:false},
    {id:v4(),name:"Or",value:"0546-566-242",marked:false}
]

app.use(express.json());

//GET
app.get('/api/contacts',(req,res) => {
    //setTimeout is just for example to show loading time
    setTimeout(() =>{

        res.status(200).json(CONTACTS);
    },1000)
})
//POST
app.post('/api/contacts',(req,res) => {
    console.log(req.body);
    const contact= {...req.body,id:v4(),marked:false}
    CONTACTS.push(contact)
    res.status(201).json(contact)
})

//DELETE 
app.delete('/api/contacts/:id',(req,res) => {
    CONTACTS = CONTACTS.filter(toDelete => toDelete.id !== req.params.id)
    res.status(200).json({message: "Contact was deleted"})
})
//PUT
app.put('/api/contacts/:id',(req,res) => {
    const indx = CONTACTS.findIndex(contactIndex => contactIndex.id === req.params.id)
    CONTACTS[indx] = req.body
    res.json(CONTACTS[indx])
})

//
app.use(express.static(path.resolve(__dirname, 'client')))
//
app.get('*',(req,res) => {
    res.status(200).sendFile(path.resolve(__dirname, 'client','index.html'));
})

const PORT =3500;
app.listen(PORT,()=>{
    console.log(`Server listening to port: ${PORT} ...`);});