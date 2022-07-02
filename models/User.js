const bcrypt = require("bcryptjs")
const usersCollection = require('../db').collection("users")
const validator = require("validator")

let User = function(data){
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function(){
    if(typeof(this.data.username) != "string"){this.data.username = ""}
    if(typeof(this.data.email) != "string"){this.data.email = ""}
    if(typeof(this.data.password) != "string"){this.data.password = ""}

    //get rid of any bogus properties
    this.data = {
        username : this.data.username.trim().toLowerCase(),
        email : this.data.email.trim().toLowerCase(),
        password : this.data.password
    }
}

User.prototype.validate = function(){
    if (this.data.username == ""){this.errors.push("You must provide a username")}
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push("Username can only contain letter and numbers.")}
    if (!validator.isEmail(this.data.email)){this.errors.push("You must provide a valid email address")}
    if (this.data.password == ""){this.errors.push("You must provide a valid password")}
    if (this.data.password.lenght > 0 && this.data.password.lenght <12) {this.errors.push("Password must be atleast 12 characters")}
    if (this.data.password.lenght > 50){this.errors.push("Password cannot exceed 50 characters")}
    if (this.data.username.lenght > 0 && this.data.username.lenght <3) {this.errors.push("Username must be atleast 3 characters")}
    if (this.data.username.lenght > 30){this.errors.push("Username cannot exceed 30 characters")}

}

User.prototype.login = function(){
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}.then((attemptedUser)=>{
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                resolve("congrats!")
            }else{
                reject("Invalid username/password.")
            }
        }).catch(function() {
            reject("Please try again later.")
        }))
    })
}

User.prototype.register = function() {
    //ste #1: validate user data
    this.cleanUp()
    this.validate()

    //step #2: only if there are no validation error
    //then save the user data into a database
    if (!this.errors.length){
        //hash user password
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt)
        usersCollection.insertOne(this.data)
    }
}

module.exports = User