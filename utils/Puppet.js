import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())


function randomPause(n) {
    return new Promise((resolve) => {
        const randomTime = Math.floor(Math.random() * 1000 + n * 100) + 400;
        setTimeout(() => {
            resolve();
        }, randomTime);
    });
}


class Puppet {
    async startBrowser(){
        try {
            const browser = await puppeteer.launch({ headless: false })
            const page = await browser.newPage()
            await page.setExtraHTTPHeaders({
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'upgrade-insecure-requests': '1',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9'
            })
            await page.setViewport({ width: 1280, height: 720 })
            
            let chromium = {browser, page}

            return chromium

        } catch (error) {
            console.log({error: 1, where: 'GptPuppet.startBrowser', errorContent: error.message})
            throw error
        }
    }

    async scrape(chromium, url){
        //await chromium.page.waitForSelector('#prompt-textarea', { visible: true });
        await chromium.page.goto(url)
        await randomPause(111)


        const elements = await chromium.page.evaluate(() => {
            const nodeList = document.querySelectorAll('jv-result-summary.ng-star-inserted');
            // Convert NodeList to an array
            const elementsArray = Array.from(nodeList);
            // Extract data or perform any other actions on the elements
            const data = elementsArray.map(element => {
                const jobTitle = element.querySelector('a.jv-result-summary-title').textContent;
                const linkElement = element.querySelector('a.jv-result-summary-title'); // Replace with the actual class name of your link
                const href = linkElement ? linkElement.getAttribute('href') : null;
                const location = element.querySelector('span.jv-result-location-country').textContent
                const listingDate = element.querySelector('em.jv-result-last-modification-date').textContent;
          
                return {
                  jobTitle,
                  href,
                  location,
                  listingDate,
                };
            });
            return data;
          });
 
        await randomPause(900)

        return elements  
    }
    
    async send(chromium, email, text){
        await randomPause(12)
        await chromium.page.waitForSelector('div.T-I-KE', { visible: true });
        await chromium.page.click('div.T-I-KE')  
        await randomPause(1)
        await chromium.page.waitForSelector('input.agP', { visible: true });

        await chromium.page.type('input.agP', email)
        await randomPause(1)
        await chromium.page.type('input.aoT', 'RECENZIONE')
        await chromium.page.type('div.editable', text)
        await chromium.page.click('div.aoO')  
        await randomPause(10)
        return 'Successful prompt'
    }
}

export default Puppet