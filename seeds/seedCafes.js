// stupid git deleting my files
// TODO: get photos from unsplash
const mongoose = require('mongoose')
const { Cafe }= require('../models/cafe')
const https = require('https')
const qs = require('querystring');
const cities = require('./id_cities.js')
const name1 = require('./name_1.js')
const name2 = require('./name_2.js')
const name3 = require('./name_3.js');

const { unsplashAccessKey } = require('../secrets/keys');

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

const callUnsplashAPI = function (pageNum, perPage) {
  return new Promise((resolve, reject) => {
    const params = {
      query: "cafe coffee",
      page: pageNum,
      per_page: perPage
    }
    const options = {
      hostname: 'api.unsplash.com',
      path: '/search/photos?' + qs.stringify(params),
      method: 'GET',
      headers: {
        "Authorization": "Client-ID " + unsplashAccessKey
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
  const imgUrls = await getPhotoUrls()
  for (let i = 0; i < num; i++) {
    const city = cities[getRandomInt(10)]
    const location = `${city.city}, ${city.admin_name}`
    const cafeName = generateName()
    const avgPrice = generatePrice(30)
    const desc = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed similique minima, non voluptas consectetur rerum nesciunt delectus quo voluptatibus tempore labore aliquid perferendis maiores, qui, beatae soluta. Quae, eligendi quod."
    const newCafe = new Cafe({
      name: cafeName,
      location,
      desc,
      avgPrice,
      imgUrls: imgUrls[i]
    })
    await newCafe.save()
    //console.log(newCafe)
    console.log("Added", newCafe.name)
  }
  return 0
}

const getPhotoUrls = async function () {
  const perPage = 25
  let fullResponse
  let curResponse
  try {
    for (let i = 0; i < 2; i++) {
      if (!fullResponse) {
        fullResponse = await callUnsplashAPI(i + 1, perPage)
        // console.log(fullResponse)
      }
      else {
        curResponse = await callUnsplashAPI(i + 1, perPage)
        // console.log(fullResponse.results)
        fullResponse.results = [...fullResponse.results, ...curResponse.results]
      }
    }
  } catch (err) {
    throw err
  }
  return fullResponse.results.map(elem => elem.urls)
}

const generateCafes = async function (num) {
  if (!unsplashAccessKey) throw "No unsplash API key";
  mongoose.connect('mongodb://127.0.0.1:27017/kopiloka', { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', async function () {
    console.log("Connected to the database...")
    try {
      await Cafe.deleteMany({})
      await generate(num)
    } catch (e) {
      console.error(e)
    } finally {
      mongoose.disconnect()
    }
  })
}


// getPhotoUrls()
//   .then(res => {
//     console.log(res)
//   })

generateCafes(50)
