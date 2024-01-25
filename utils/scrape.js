import Job from './database/Job.js'

async function scrape(browser, current_page){
  
    let url_vienna = `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=at13&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
    let url_swiss =  `https://europa.eu/eures/portal/jv-se/search?page=${current_page}&resultsPerPage=50&orderBy=BEST_MATCH&locationCodes=ch&keywordsEverywhere=entwickler,node,rust,c,c%2B%2B,translator,ubersetzer,software,embedded&lang=en`
    
    let inserts = await puppet.scrape(browser, url_vienna)
  
    await inserts.forEach(async insert => { 
  
      let job = new Job({page: current_page, insert})
      await job.save()
       
    })
  
    return
  }


async function scrape_jobs(){
    let page = 1
  let browser = await puppet.startBrowser()

  while(true){
    if(page > 200){
      break
    }
    console.log(page)

    await scrape(browser, page)
    page++

    
  }
}

export default scrape()