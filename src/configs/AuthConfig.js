require('dotenv').config()
module.exports = {
    jwt : {
        secret : process.env.SECRET,
        expiresIn : "1d"
    }
}

//the secret was the problem here ??????