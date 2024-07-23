const express = require('express');
const app = express();
const collection = require("./config");
const bcrypt = require('bcrypt')
// const bodyParser = require('body-parser')

// Setting EJS as the view engine
app.set('view engine', 'ejs');

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

    const data = {
        name: req.body.name,
        password: req.body.password
    }
    

    const existingUser = await collection.findOne({ name: data.name })
    try {
        if (existingUser) {
            res.render('signup', { message: "User already exists!", type: 'negative' });
        } else {
            //Hashing the password
            try {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
                console.log(hashedPassword)
                data.password = hashedPassword;
            }
            catch (err) {
                console.log(`There was an error hashing the password: ${err}`)
            }

            const payLoad = await collection.create(data)
            console.log(payLoad);
            res.render('signup', { message: "You have successfully registered!", type: 'positive'});
        }
    } catch (err) {
        res.end(err)
    }
});

app.post("/login", async (req, res) => {

    try {
        // Finding if the data is stored in the database or not.
        const check = await collection.findOne({ name: req.body.name })

        if (!check) {
            res.render('login', {message:"User not found", type: 'negative'})
            return // Return because it was breaking the web app. By using return, the code stops here until a valid data is sent.
        }

        let match = await bcrypt.compare(req.body.password, check.password)

        if (match === true) {
            res.render("loghome")
        } else {
            res.render('login', {message:"Wrong Password!", type: 'negative'})
    
        }

    }  catch (err) {

        res.send(`Something went wrong! ${err}`)

    }

});
const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});