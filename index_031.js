const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { PerformanceObserver, performance } = require('perf_hooks');
const profiler = require('v8-profiler-node8');
const v8Profiler = require("v8-profiler-next");
const start = v8Profiler.startProfiling("cpuprofile");
const title = 'aidtaas_030';



console.profile()
async function startScrapping() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 716,
        deviceScaleFactor: 1,
    });
    const targetUrl = 'https://learnwebcode.github.io/practice-requests/';
    await page.goto(targetUrl);
    const elementsInfo = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a, button, div')).map(element => {
            return {
                tagName: element.tagName,
                attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`),
                textContent: element.textContent.trim(),
            };
        });
    });


    await browser.close();
}



function startloop() {
    for (let i = 0; i < 100000000; i++) {
        let val = i;
    }
    return "loopEnd";
}




function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

    //paused for 5 seconds
    await delay(5000);
    await startScrapping();
    startloop()

    //paused for 5 seconds
    await delay(5000);
    await startScrapping()

    console.profileEnd();
}

main();








