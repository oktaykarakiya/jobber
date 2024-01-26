import Job from '../database/Job.js'

import Puppet from './Puppet.js'
let puppet = new Puppet()


async function scrape(browser, current_page){
  
    let url_vienna = `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at13&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
    let url_swiss =  `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=ch&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
    
    let inserts = await puppet.scrape(browser, url_vienna)
  
    for(let x = 0; x < inserts.length; x++){
      let job = new Job(inserts[x])

      console.log(inserts[x].email)
      
      await job.save()
    }
    

    return inserts.length
  }


async function scrape_jobs(){
  let browser = await puppet.startBrowser()

  let page = 1

  while(true){
    if(page > 200){
      break
    }
    console.log(page)

    let stopper = await scrape(browser, page)
    page++
    if(stopper < 50){
      return
    }
  }

  return
}

export default scrape_jobs
