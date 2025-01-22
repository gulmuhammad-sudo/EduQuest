const { populateUniversity } = require("./university");
const User = require('../models/User');

const populateUser = async () => {
    User.findOne({name: "admin"}).then(admin => {
        if(!admin){
            const user = new User({
                name: "admin",
                email: "admin@eduquest.com",
                password: "password",
                role: "admin"
            })
            user.save();
            console.log("admin created ")
        }
    })
}


module.exports = {
    populateUser
}