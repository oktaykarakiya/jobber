import express from 'express'
const app = express()
const port = 3001

import database from './database/config.js'
database()

import dotenv from 'dotenv'
dotenv.config()


import scrape_jobs from './utils/scrape_jobs.js'

scrape_jobs()






  app.get('/', (req, res) => {
    res.send(`hello`);
  });


app.listen(port, () => {
  console.log(`Started on port ${port}`)
})
