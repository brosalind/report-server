const errorHandler = (err, req, res, next) => {
    if(err.name === 'ValidationError'){
        for (const path in err.errors) {
            res.status(400).json({message:`${err.errors[path].properties.message}`})
          }
    } else if(err.name ==='noEmail') {
        res.status(400).json({
            message: "Please input your email."
        })
    } else if(err.name ==='noPassword') {
        res.status(400).json({
            message: "Please input your password."
        })
    } else if(err.name ==='userDoesNotExist') {
        res.status(400).json({
            message: "Invalid user. Please register first or make sure your login details are correct."
        })
    } else if(err.name === 'wrongPassword'){
        res.status(400).json({
            message: "Incorrect password. Please try again."
        })
    } else if(err.name === 'JsonWebTokenError'){
        res.status(401).json({
            message: "Please login first."
        })
    } else if(err.name ==='notFound'){
        res.status(404).json({
            message: "What you're looking for does not exist."
        })
    } else if(err.name ==='Unauthorized'){
        res.status(403).json({
            message: "We're sorry, but you don't have access."
        })
    }
    else {
        console.log(err)
        res.status(500).json({message: "Something happened. Please try again later."})
    }
}

module.exports = {errorHandler}