const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const validator = require('validator')

const https = require("https")
const Account = require("./model/login")

const bcrypt = require('bcrypt')
const saltRounds = 10

const { Router } = require('express')
const { urlencoded } = require('body-parser')

const PORT = process.env.PORT || 5000

mongoose.connect("mongodb+srv://admin-manveenbhullar:Tasmania26@@cluster0.stah1.mongodb.net/iServiceDB?retryWrites=true&w=majority", { useNewUrlParser:true });

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.route('/')
.get((req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

.post((req, res) => {
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const password = req.body.password
    const conpass= req.body.conpass
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const number = req.body.number
    const hash = bcrypt.hashSync(password, saltRounds)

    if (!validator.equals(password, conpass)){
        res.status(400).send("Passwords do not match!")
    }
    else {
        const New_account = new Account({
            fname: fname,
            lname: lname,
            email: email,
            password: hash,
            conpass: hash,
            address: address,
            city: city,
            state: state,
            number: number,
        })

        New_account
        .save()
        .catch((err) => console.log(err))

        if (res.statusCode === 200) {
            res.sendFile(__dirname + "/loginform.html")
        }
        else {
            res.send("Error! Fail to add data to database.")
        }

        const data = {
            members: [{
                email: email,
                status: "Subscribed successfully!",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }]
        }


jsonData = JSON.stringify(data)
    
    const url ="https://us5.api.mailchimp.com/3.0/lists/1796f77f52"
    const options= {
        method:"POST",
        auth: "mishi:9b6e6c10e84124021a2fa545d6b86764-us5"
    }
    
    const request = https.request(url, options, (response)=>{

        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })
    })
    request.write(jsonData)
    request.end()
    console.log(fname, lname, email)
}
})

app.route('/loginform')
.get((req, res)=>{
    res.sendFile(__dirname + "/loginform.html")
})

.post((req, res) => {
    const loginform_email = req.body.email
    const loginform_password = req.body.password
    const hash = bcrypt.hashSync(loginform_password, saltRounds);

    Account.findOne({ email: loginform_email }, function (err, foundemail) {
        if (err) {
            console.log(err)
        }
        else if (foundemail === null) {
            res.send("This email does not exist! Please register.")
        }
        else {
            console.log(foundemail)
            if (bcrypt.compareSync(loginform_password, foundemail.password))
            {
                res.send("You are logged in.")
            }
        }
    })
})

app.listen(PORT, (req, res) => {
console.log("Server is running on port 5000")
})