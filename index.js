const express = require('express');
const mongoose = require('mongoose');
const path = require('path')

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname,'build')))





app.get('/api',(req,res)=>{
    Todo.find().then(todo=>res.json(todo))
})

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/fullstack"



mongoose.connect(url,({useNewUrlParser:true}))
.then(console.log("db connected showing databse"))
.catch(err=>console.log(err))



const schema=new mongoose.Schema({
    task:String,
    complete:{
        type:Boolean,
        default:false
    }
})

const Todo = mongoose.model('todo',schema)



app.get('/api/todos',function(req,res){
    Todo.find().then(todo=>res.json(todo))
})

app.post('/api/todos',function(req,res){
    const new_task = new Todo({
        task:req.body.task
    })
    new_task.save().then(todo=>res.json(todo))
})

app.delete('/api/todos/:id',function(req,res){
    Todo.findByIdAndDelete(req.params.id)
    .then(()=>res.json({remove:true}))
})

app.put('/api/todos/:id',function(req,res){

    const t = Todo.findById(req.params.id,function(err,data){
        if(err)
        console.log(err)
        else{

            const s = data['complete']



            Todo.findByIdAndUpdate(req.params.id,{
            
                    complete: !s
                },function(err){
                    if(err) console.log(err)
                })
        }
        
        
    })

});

app.get('/*',(req,res) =>{
    res.sendFile(path.join(__dirname,'../frontend/build','index.html'))
})



const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`server running at ${port}`)
});

