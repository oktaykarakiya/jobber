import express from 'express'
const app = express()
const port = 3001

import database from './database/config.js'
database()

import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'

import Puppet from './utils/Puppet.js'
let puppet = new Puppet()

import Job from './database/Job.js'


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


let currentActiveSessions = 0
let id = 0

async function operation_impossible(browser, current_page){
  
  let url_vienna = `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at13&lang=en`
  let url_eures = `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at,ch&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
  let inserts = await puppet.scrape(browser, url_vienna)
  await inserts.forEach(async insert => { 
    id ++

    let job = new Job({id, page: current_page, insert})
    await job.save()
     
  })

  return currentActiveSessions--
}


let page = 1
async function scrape_jobs(){
  let browser = await puppet.startBrowser()

  while(true){
    if(page > 200){
      break
    }
    console.log(page)

    await operation_impossible(browser, page)
    page++

    // if(currentActiveSessions < 2){
    //   operation_impossible(browser, page)
    //   currentActiveSessions++
    //   page++
    //   continue
    // } else {
    //   await operation_impossible(browser, page)
    //   page++
    // }

    
  }
}

scrape_jobs()







  app.get('/', (req, res) => {
    res.send(`hello`);
  });


app.listen(port, () => {
  console.log(`Started on port ${port}`)
})
