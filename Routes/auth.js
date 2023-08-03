const router = require('express').Router();
const User = require('../Models/user');
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');
//Register

router.post("/register", async (req, res) => {
    const { username,password} = req.body;
    const existingUser = await User.findOne({username:username});
    if (existingUser) {
         res.status(400).json({error:true,message:'User Already Exists please try to login'});
    }
    else {
        const newUser = new User({
            username: username,
            password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
            
        });
        try {
            const savedUser = await newUser.save();
            res.status(201).json({error:false,user:savedUser});
        } catch (err) {
            res.status(500).json({error:true,message:`Internal server error ${err}`});
        }
    }
})


//login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        !user && res.status(401).json({error:true,message:"Cannot Find User, Please Register"});
        const hashedPass = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json({error:true,message:"Wrong Password!"});

        const accesTocken = jwt.sign({
            id: user._id,
        }, process.env.JWT_SEC
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accesTocken });

    } catch (err) {
        
    }

})

module.exports = router;