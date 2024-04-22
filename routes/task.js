const router = require("express").Router();
const task = require("../Models/task");

router.post("/",async(req,res)=>{
    const newTask = new task(req.body);
    try{
        const savedTask = await newTask.save();
        res.status(200).json({
            error:false,
            task:savedTask
        });
    }
    catch(err){
        res.status(500).json({error:true,message:`Internal server Error ${err}`});
        console.log(err);
    };
});

router.get("/:userid",async(req,res)=>{
    let sort = req.query.sort || "asc";
    let priority = req.query.priority || "All";
    let completed = req.query.completed || "All"

    req.query.sort ? (sort = req.query.sort.split(",")) : sort=[sort];

    let sortBy={};
    if(sort[1]){
        sortBy[sort[0]] = sort[1];
    }
    else{
        sortBy[sort[0]] = "asc";
    }

    completed === "All"
        ? completed = [true,false]
        : completed = [completed];

    priorityOptions = [1,2,3];
    priority === "All" ? priority = [...priorityOptions] : priority = (req.query.priority);
    try {
        const foundTasks = await task.find({userId:req.params.userid,priority:{$in:[...priority]}})
        .where("completed").in(completed)
        .sort(sortBy);
        res.status(200).json({
            error:false,
            task:foundTasks,
            priority:priority
        })
    } catch (error) {
        res.status(200).json({
            error:true,
            message:`Internal Server Error ${error}`
        })
    }
});

router.put("/update/:id",async(req,res)=>{
    try {
        const item = await task.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({
            error:true,
            message:"Error" + error
        })
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const item = await task.findByIdAndDelete(req.params.id);
        res.status(200).json(item);
    } catch (error) {
        res.status(500)
    }
})

module.exports = router;