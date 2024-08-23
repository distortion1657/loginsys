const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const session = require('express-session')
const {loginModel, msgModel} = require("./config");
const mongostore = require("connect-mongo")

const port = 5000;


// Setting EJS as the view engine
app.set('view engine', 'ejs');


app.use(session({
    resave: false,
    secret: `i'm going to marry nyx`,
    saveUninitialized: false,
    store: mongostore.create({mongoUrl: 'mongodb+srv://agamanstha41:pTeVU2kBtCnQzv0o@distortion.61lbmo2.mongodb.net/Web-App?retryWrites=true&w=majority&appName=distortion'}),
    cookie: {secure: false}
    
}))

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/login", (req, res) => {
    res.render("login" , { type: "", message: " "})
});

app.get("/signup", (req, res) => {

    res.render("signup", { type: "", message: " " })

});

app.post("/signup", async (req, res) => {

    const data = 
    {
        name: req.body.name,
        password: req.body.password
    }
    
    const existingUser = await loginModel.findOne({ name: data.name })
    try {
        if (existingUser) {
            res.render('signup', { message: "User already exists!", type: 'negative' });
        } else {
            //Hashing the password
            try {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
                data.password = hashedPassword;
            }
            catch (err)
            {
                console.log(`There was an error hashing the password: ${err}`);
            }
            const payLoad = await loginModel.create(data);
            console.log(payLoad);
            res.render('signup', { message: "You have successfully registered!", type: 'positive'});
        }

    } catch(err) {
        res.end(err);
    }
});

app.post("/login", async (req, res) => {

    const username = req.body.name;
    req.session.username = username
    console.log(username)

    try {
        // Finding if the user is registered in the database or not.
        const check = await loginModel.findOne({ name: req.body.name })

        // User could not be found.
        if (!check) {
            res.render('login', {message:"User not found", type: 'negative'})
            return // Return because it was breaking the web app. By using return, the code stops here until a valid data is sent.
        }

        // Checking if the password is correct or not.
        let match = await bcrypt.compare(req.body.password, check.password)

        // User was found
        if (match === true) {
            res.redirect('loghome') 
        }
        else {
            res.render('login', {message:"Wrong Password!", type: 'negative'});
        }

    }  catch (err) {

        res.send(`Something went wrong! ${err}`)

    }

});
app.get('/user-session', (req,res)=>{
    if(!req.session.username){
        res.send("You have not logged in.")
    }else{
        res.send(`You are logged in as user: ${req.session.username}`)
    }
})

app.get('/loghome', async (req,res)=>{

    console.log(`User data: ${req.session.username}`)
    const username = req.session.username
    if (!req.session.username){
        res.redirect('login')
        console.log(`User hasn't logged in!`)
        return;
    }
    else{
        const usermessage = await msgModel.find()

    res.render("loghome" , {user: username, user_message: usermessage}) // Username is being passed to display in the home page.
    }
})
app.post('/loghome', async(req,res)=>{
    // This is to store the username even after the user posts something
    const user = req.session.username


    try{
    const newMsg = [await msgModel.create({message: req.body.message})]
    const oldMsg = [await msgModel.find()]
    console.log(oldMsg)
    res.render("loghome",  {user: user, user_message: oldMsg})


    }catch(err){
        console.log(`Something went wrong! ${err}`)
    }

})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});