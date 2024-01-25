import express from 'express'
const app = express()
const port = 3001

import database from './database/config.js'
database()

import dotenv from 'dotenv'
dotenv.config()

import Puppet from './utils/Puppet.js'
let puppet = new Puppet()



import read_file from './utils/read_file.js'
import write_file from './utils/write_file.js'
write_file({test: 'emails'}, 'test')

let jobs = read_file('./best')

async function get_details(){
  let chrom = await puppet.startBrowser()

  let emails = []


  for(let x = 0; x < jobs.length; x++){
    if(jobs[x].name.insert.location.toLowerCase().includes('austria')){
      const link = `https://europa.eu${jobs[x].name.insert.link}`

      let teeett = await puppet.get_emails(chrom, link)

      if(teeett){
        console.log(teeett)
        emails.push(teeett[0])
      }
      
    }
  }

  write_file(emails, 'emails')

}
get_details()




  app.get('/', (req, res) => {
    res.send(`hello`);
  });


app.listen(port, () => {
  console.log(`Started on port ${port}`)
})
