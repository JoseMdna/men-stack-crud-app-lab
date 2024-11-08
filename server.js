require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const HikingTrail = require('./models/hikingtrail')
const app = express()
const methodOverride = require('method-override');


app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error))
  



app.get('/trails', (req, res) => {
    HikingTrail.find().then(trails => {
      res.render('index', { trails });
    });
  });


app.get('/trails/new', (req, res) => {
    res.render('new');
  })


app.get('/trails/:id', (req, res) => {
    HikingTrail.findById(req.params.id).then(trail => {
      res.render('show', { trail });
    });
  });


  app.post('/trails', (req, res) => {
    const newTrail = new HikingTrail({
        name: req.body.name,
        location: req.body.location,
        difficulty: req.body.difficulty,
        distance: req.body.distance,
        elevationGain: req.body.elevationGain,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    });

    newTrail.save()
        .then(() => res.status(201).json({ message: 'Trail created successfully!' }))
        .catch(err => res.status(500).json({ error: 'Failed to create trail', details: err }));
});


app.get('/trails/:id/edit', (req, res) => {
    const trailId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(trailId)) {
        return res.status(400).send("Invalid Trail ID");
    }

    HikingTrail.findById(trailId).then(trail => {
        if (!trail) {
            return res.status(404).send("Trail not found");
        }
        res.render('edit', { trail });
    }).catch(err => {
        res.status(500).send("Server error");
    });
});


app.put('/trails/:id', (req, res) => {
    const trailId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(trailId)) {
        return res.status(400).send("Invalid Trail ID");
    }

    HikingTrail.findByIdAndUpdate(trailId, req.body, { new: true, runValidators: true })
        .then(updatedTrail => {
            if (!updatedTrail) {
                return res.status(404).send("Trail not found");
            }
            res.redirect(`/trails/${trailId}`);
        })
        .catch(err => res.status(500).send("Failed to update trail"));
});



app.delete('/trails/:id', (req, res) => {
    const trailId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(trailId)) {
        return res.status(400).send("Invalid Trail ID");
    }

    HikingTrail.findByIdAndDelete(trailId)
        .then((deletedTrail) => {
            if (!deletedTrail) {
                return res.status(404).send("Trail not found");
            }
            res.redirect('/trails');
        })
        .catch(err => res.status(500).send("Failed to delete trail"));
});





const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))





