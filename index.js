const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')
const { Cafe } = require('./models/cafe')

mongoose.connect('mongodb://localhost/kopiloka', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log("Connected to the database...")
})

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(expressLayouts)

app.get('/cafes', async function (req, res) {
  try {
    const cafes = await Cafe.find();
    const locals = {
      title: "Cafes"
    }
    res.render('cafes/index', { locals, cafes })
  } catch (e) {
    notFoundRoute(req, res, e)
  }
})

app.post('/cafes', async function (req, res) {
  const defaultImgUrls = {
    "raw": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1",
    "full": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=85",
    "regular": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=1080",
    "small": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=400",
    "thumb": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=200"
  }
  try {
    const { cafe } = req.body
    cafe.imgUrls = defaultImgUrls
    const newCafe = new Cafe(cafe)
    await newCafe.save()
    res.redirect('/cafes')
  } catch (e) {
    notFoundRoute(req, res, e)
  }
})

app.get('/cafes/new', function (req, res) {
  const locals = {
    title: "New Cafe"
  }
  res.render('cafes/new', { locals })
})

app.get('/cafes/:id', async function (req, res) {
  try {
    const { id } = req.params
    const cafe = await Cafe.findById(id)
    const locals = {
      title: cafe.name
    }
    console.log(cafe.imgUrls)
    res.render('cafes/details', { locals, cafe })
  } catch (e) {
    notFoundRoute(req, res, e)
  }
})

app.delete('/cafes/:id', async function (req, res) {
  try {
    const { id } = req.params
    const cafe = await Cafe.findByIdAndDelete(id)
    res.redirect('/cafes')
  } catch (e) {
    notFoundRoute(req, res, e)
  }
})

app.put('/cafes/:id', async function (req, res) {
  try {
    const { id } = req.params
    const { cafe } = req.body
    const updatedCafe = await Cafe.findByIdAndUpdate(id, cafe)
    res.redirect(`/cafes/${updatedCafe._id}`)
  } catch (e) {
    notFoundRoute(req, res, e)
  }
})

app.get('/cafes/:id/edit', async function (req, res) {
  try {
    const { id } = req.params
    const cafe = await Cafe.findById(id)
    const locals = {
      title: `Edit ${cafe.name}`
    }
    res.render('cafes/edit', { locals, cafe })
  } catch (e) {
    notFoundRoute(req, res, e)
  }
})

app.get('/', function (req, res) {
  const locals = {
    title: "Fade away"
  }
  res.render('index', { locals })
})

app.use(function (req, res) {
  notFoundRoute(req, res)
})

function notFoundRoute(req, res, e) {
  if (e)
    console.error(e)
  res.send("Something went wrong...")
}

app.listen(port, function () {
  console.log(`Listening on port ${port}...`)
})