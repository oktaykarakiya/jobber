import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

import extract_emails from './extract_emails.js'

import Job from '../database/Job.js'

function randomPause(n) {
    return new Promise((resolve) => {
        const randomTime = Math.floor(Math.random() * 1000 + n * 100) + 400;
        setTimeout(() => {
            resolve();
        }, randomTime);
    });
}


class Puppet {
    async startBrowser() {
        try {
            const browser = await puppeteer.launch({ headless: false })
            return browser

        } catch (error) {
            console.log({ error: 1, where: 'GptPuppet.startBrowser', errorContent: error.message })
            throw error
        }
    }

    async scrape(chromium, url) {
        const page = await chromium.newPage()

        await page.setExtraHTTPHeaders({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'upgrade-insecure-requests': '1',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9'
        })
        await page.setViewport({ width: 1280, height: 720 })

        await page.goto(url)
        await randomPause(200)
        const elements = await page.evaluate(() => {
            const nodeList = document.querySelectorAll('jv-result-summary.ng-star-inserted');
            // Convert NodeList to an array
            const elementsArray = Array.from(nodeList);
            // Extract data or perform any other actions on the elements
            const data = elementsArray.map(element => {
                const title = element.querySelector('a.jv-result-summary-title').textContent;
                const linkElement = element.querySelector('a.jv-result-summary-title'); // Replace with the actual class name of your link
                const link = linkElement ? linkElement.getAttribute('href') : null;
                const location = element.querySelector('span.jv-result-location-country').textContent
                const date = element.querySelector('em.jv-result-last-modification-date').textContent
                const employer = element.querySelector('span.jv-result-employer-name').textContent

                let schedule
                let category 
                try {
                    schedule = element.querySelector('span.jv-result-position-schedule-code').textContent
                    category = element.querySelector('span.jv-result-job-category').textContent
                } catch (error) {
                    
                }

                return {
                    title,
                    link,
                    location,
                    date,
                    emails: null,
                    employer,
                    schedule,
                    category
                };
            }); 


            return data;
        });


        for (let x = 0; x < elements.length; x++) {
            await page.goto(`https://europa.eu${elements[x].link}`)
            await randomPause(50)
            const body = await page.evaluate(() => { return document.body.innerText; });
            const emails = await extract_emails(body)
            elements[x].emails = emails

            try {
                let job = new Job(elements[x])
                await job.save()
            } catch (error) {
                console.log(error.message) // TODO: telegram it in the future
            }

        }


        await randomPause(50)

        await page.close()

        return elements
    }
}

export default Puppet