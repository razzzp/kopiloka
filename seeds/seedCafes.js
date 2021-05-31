// stupid git deleting my files
// TODO: get photos from unsplash
const mongoose = require('mongoose')
const { Cafe } = require('../models/cafe')
const https = require('https')
const qs = require('querystring');
const cities = require('./id_cities.js')
const name1 = require('./name_1.js')
const name2 = require('./name_2.js')
const name3 = require('./name_3.js');
const { resolve } = require('path');

const myAccessKey = "YVw_gKpbaoIouFxq1tVCrjmuGgHdCp0R9UB8fkp-EiE"

const getRandomInt = function (max) {
  return Math.floor(Math.random() * max)
}

const generateName = function () {
  let cafeName = name1[getRandomInt(name1.length - 1)]
  cafeName += " " + name2[getRandomInt(name2.length - 1)]
  cafeName += " " + name3[getRandomInt(name3.length - 1)]
  return cafeName
}

const generatePrice = function (max) {
  const rawPrice = Math.random() * max
  const decimal = Math.floor(rawPrice * 100) - Math.floor(rawPrice) * 100
  return Math.floor(rawPrice) + decimal / 100
}

const getPhotos = function () {
  return new Promise((resolve, reject) => {
    const params = {
      query: "cafe coffee",
      per_page: 10
    }
    const options = {
      hostname: 'api.unsplash.com',
      path: '/search/photos?' + qs.stringify(params),
      method: 'GET',
      headers: {
        "Authorization": "Client-ID " + myAccessKey
      }
    }
    const req = https.request(options, res => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      console.log(`statusCode: ${statusCode}`)
      console.log(`contentType: ${contentType}`)
      //
      //get data
      res.setEncoding('utf8')
      let rawData = '';
      res.on('data', d => {
        rawData += d
      })
      res.on('end', () => {
        if (/^application\/json/.test(contentType)) {
          try {
            const parsedData = JSON.parse(rawData)
            resolve(parsedData)
          } catch (e) {
            console.error(e)
            reject("Cannot parse response")
          }
        }
        else {
          reject("Response is not JSON")
        }
      })
    })
    req.on('error', error => {
      reject(error)
    })
    req.end()
  })
}

const generate = async function (num) {
  for (let i = 0; i < num; i++) {
    const city = cities[getRandomInt(10)]
    const location = `${city.city}, ${city.admin_name}`
    const cafeName = generateName()
    const avgPrice = generatePrice(30)
    const newCafe = new Cafe({
      name: cafeName,
      location,
      avgPrice
    })
    await newCafe.save()
    //console.log(newCafe)
    console.log("Added", newCafe.name)
  }
  return 0
}
const generateCafes = async function (num) {
  mongoose.connect('mongodb://localhost/kopiloka', { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log("Connected to the database...")
  })
  try {
    await Cafe.deleteMany({})
    await generate(num)
  } catch (e) {
    console.error(e)
  } finally {
    mongoose.disconnect()
  }
}

// generateCafes(50)
getPhotos()
  .then(res => {
    console.log(res)
  })
  .catch((err)=>{
    console.error(err)
  })
