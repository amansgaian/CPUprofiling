const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { PerformanceObserver, performance } = require('perf_hooks');
const profiler = require('v8-profiler-node8');
const v8Profiler = require("v8-profiler-next");
const start = v8Profiler.startProfiling("cpuprofile");
const title = 'aidtaas_38';


// set generateType 1 to generate new format for cpuprofile
// to be compatible with cpuprofile parsing in vscode.
v8Profiler.setGenerateType(1);

// ex. 5 mins cpu profile
v8Profiler.startProfiling(title, true);

setTimeout(() => {
    const profile = v8Profiler.stopProfiling(title);
    profile.export(function (error, result) {

        // const interval = setInterval(() => {


        // setTimeout(() => { }, 20000);
        //  await new Promise(r => setTimeout(r, 20000))

        setTimeout(() => {
            (async function startScrapping() {
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

                console.log(`${title}.cpuprofile`, result);
                await fs.writeFile(`${title}.cpuprofile`, result);
                await browser.close();
            })();
        }, 5000)

        // }, 2000)
        // setTimeout(() => clearInterval(interval), 5000)  
        // fs.writeFile("testText.txt", arr.join("\n"));
        // profile.delete();
    });
}, 5000);






