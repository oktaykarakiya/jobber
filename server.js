import express from 'express'
const app = express()
const port = 3000

import database from './database/config.js'
database()

import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'

import Puppet from './utils/Puppet.js'
let puppet = new Puppet()


function track(data) {
  const jsonData = JSON.stringify(data, null, 2)

  fs.writeFile('tracking.json', jsonData, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      return;
    }
    console.log('File has been saved.');
  })
}


let page = 1

let url_eures = `https://europa.eu/eures/portal/jv-se/search?page=${page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at,ch&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`

async function scrape_jobs(eures){
  let browser = await puppet.startBrowser()
  let inserts = await puppet.scrape(browser, eures)
  track(inserts)
  console.log(inserts)
}

scrape_jobs(url_eures)








  app.get('/', (req, res) => {
    res.send(`hello`);
  });


app.listen(port, () => {
  console.log(`Started on port ${port}`)
})
