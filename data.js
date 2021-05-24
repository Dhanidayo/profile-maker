const express = require('express');
const app = express();
const port = process.env.PORT || 8000;


//setting up mongoose
const mongoose = require('mongoose');
const connectionString = process.env.connectionString || 'mongodb://localhost:27017/profile-maker';

app.use(express.json());

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log(err)
    }else{
        console.log("Connected to Database")
    }
})

const profileSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String
})
const Profile = mongoose.model('Profile', profileSchema);

///redirect base link to profiles
app.get('/', (req, res) => {
    res.redirect('/profiles');
})

//posts requests to /profiles to create a new profile
app.post('/Profiles', function(req, res) {
    Profile.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, newProfile) => {
        if (err) {
            return res.status(500).json({ message: err })
        }else {
            return res.status(200).json({ message: "Profile created successfully", data: newProfile })
        }
    })
})

//Get request to /profiles to fetch all profiles
app.get('/profiles', (req, res) => {
    //fetch all profiles
    Profile.find({}, (err, profiles) => {
        if (err) {
            return res.status(500).json({ message: err })
        }else{
            return res.status(200).json({ message: "Fetched Profiles successfully", data: profiles })
        }
    })
})

//Get request to /profiles/:id to fetch a single profile
app.get('/profiles/:id', (req, res) => {
    //the findById method
    Profile.findById(req.params.id, (err, profile) => {
        if (err) {
            return res.status(500).json({ message: err })
        }else if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }else{
           return res.status(200).json({message: "Fetched profile successfully", data: profile })
        }
    })
})
//Put request to /profiles/:id to update a profile
app.put('/profiles/:id', (req, res) => {
    Profile.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        country: req.body.country
    }, (err, profile) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else if (!profile) {
            return res.status(404).json({ message: "Profile not found" })
        }else {
            profile.save((err, savedProfile) => {
                if (err) {
                    return res.status(400).json({ message: err })
                } else {
                    return res.status(200).json({ message: "Profile updated successfully", data: profile })
                }
            })           
        }
    })
})

//Delete request to /profiles/:id to delete
app.delete('/profiles/:id', (req, res) => {
    Profile.findByIdAndDelete(req.params.id, (err, profile) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else if (!profile) {
            return res.status(404).json({ message: "Profile not found"})
        }else{
            return res.status(200).json({ message: "Profile deleted successfully" })
        }
    })
})


app.listen(port, () => console.log(`app listening on port ${port}`));