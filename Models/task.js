const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task:{type:String,required:true},
    desc:{type:String,required:true},
    priority:{type:Number,required:true},
    deadline:{type:Date,required:true},
    userId:{type:String,required:true},
    completed:{type:Boolean,default:false},
})

module.exports = mongoose.model('task',taskSchema);