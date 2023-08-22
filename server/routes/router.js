const express = require("express");
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const router = new express.Router();
const authenticate = require ("../middleware/authenticate");




//get productsdata api
router.get("/getproducts", async (req, res) => {
    try {
        const producstdata = await Products.find();
        console.log(producstdata );
        res.status(201).json(producstdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});


router.get("/getproductsone/:id", async(req,res)=>{
    try{
        const {id}= req.params;
        // console.log(id);

        const individualdata = await Products.findOne({id:id});
        // console.log(individualdata + "individual data");

        res.status(201).json(individualdata);
    }catch(error){
        res.status(400).json(individualdata);
        console.log("error" + error.message );

    }
});


router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { name, email, number, password, cpassword } = req.body;

    if (!name || !email || !number || !password || !cpassword) {
        res.status(422).json({ error: "fill the all details" });
        console.log("no data available");
    };

    try {

        const preuser = await USER.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This user is already exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password are not matching" });;
        } else {

            const finaluser = new USER({
                name, email, number, password, cpassword
            });



           

            const storedata = await finaluser.save();
           
            res.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error" + error.message);
        res.status(422).send(error);
    }

});


router.post("/login",async(req,res)=>{
    const { email,password } = req.body;
    if(!email || !password){
        res.status(400).json({error:"fill the all data"})
    }
try{
    const userlogin = await USER.findOne({email:email})
    console.log(userlogin + " user value");
if(userlogin){
    const isMatch = await bcrypt.compare(password,userlogin.password);
    // console.log(isMatch);


    //token 
    const token = await userlogin.generatAuthtoken();
    console.log(token);
    
    res.cookie("amazonweb",token,{
        expires:new Date(Date.now()+ 900000),
        httpOnly:true
    })

    if(!isMatch){
        res.status(400).json({error:"password not match."})
    }else{
        res.status(201).json(userlogin)
    }
}else{
    res.status(400).json({error:"invalid details"})
}
}catch(error){
    res.status(400).json({error:"invalid details"})

}

})


//add to cart
router.post("/addcart/:id",authenticate, async(req,res)=>{
    try{
        
        const {id} = req.params;
        const cart = await Products.findOne({id:id});
        console.log(cart + "cart value")

        const UserContact = await USER.findOne({_id: req.userID})
console.log(UserContact);
if(UserContact){
    const cartData = await UserContact.addcartdata(cart);
    await UserContact.save();
    console.log(cartData); 
    res.status(201).json(UserContact)
}else{
    res.status(401).json({error:"invalid user"});
}

    }catch(error){
        res.status(401).json({error:"invalid user"});

    }
})


// get cart details
router.get("/cartdetails", authenticate, async(req,res)=>{
    try{
        const buyuser = await USER.findOne({_id:req.userID});
        res.status(201).json(buyuser);

    }catch(error){
console.log("error"+ error);
    }
})



module.exports = router;