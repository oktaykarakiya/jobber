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

import read_file from './utils/read_file.js'
import write_file from './utils/write_file.js'




let currentActiveSessions = 0
let id = 0

async function operation_impossible(browser, current_page){
  
  let url_vienna = `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at13&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
  let url_swiss =  `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=ch&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
  
  let inserts = await puppet.scrape(browser, url_vienna)

  await inserts.forEach(async insert => { 
    id ++

    let job = new Job({id, page: current_page, insert})
    await job.save()
     
  })

  let inserts2 = await puppet.scrape(browser, url_swiss)
  
  await inserts2.forEach(async insert => { 
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

//scrape_jobs()


let test = read_file('./utils/best')
console.log(test.length)

let countera = 0

async function get_details(){
  let chrom = await puppet.startBrowser()
  test.forEach(async (job) => {
    if(job.name.insert.location.toLowerCase().includes('switzerland')){
      const link = `https://europa.eu${job.name.insert.link}`


      let teeett = await puppet.get_emails(chrom, link)

      
      console.log(teeett)

    }
  })

}

get_details()


  app.get('/', (req, res) => {
    res.send(`hello`);
  });


app.listen(port, () => {
  console.log(`Started on port ${port}`)
})
