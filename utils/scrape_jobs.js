

import Puppet from './Puppet.js'
let puppet = new Puppet()


async function scrape(browser, current_page){
  
    let url_vienna = `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at13&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
    let url_swiss =  `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=ch&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
    
    let inserts = await puppet.scrape(browser, url_vienna)    

    return inserts.length
  }


async function scrape_jobs(){
  let browser = await puppet.startBrowser()

  let page = 1

  while(true){
    if(page > 200){
      break
    }

    let stopper = await scrape(browser, page)
    page++
    if(stopper < 50){
      return
    }
  }

  return
}

export default scrape_jobs
