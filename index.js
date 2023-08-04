const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const json = require('express').json;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const taskRoute = require('./routes/task.js');
const authRoute = require('./routes/auth.js');
app.use(cors());
app.use(json());

mongoose.connect(process.env.DATABSE_URL);
mongoose.connection.on('connected',()=>{
    console.log("Database Connected Succesfully");
});


app.use("/api/tasks",taskRoute);
app.use("/api/auth",authRoute);

mongoose.connection.on("error",(err)=>{
    console.log(`Error Found ${err}`);
});

mongoose.connection.on('disconnected',()=>{
    console.log("DisConnected");
})

const port = process.env.PORT || 5000;  
app.listen(port , ()=>{
    console.log(`Server started Succsfully at port ${port}`)
});


