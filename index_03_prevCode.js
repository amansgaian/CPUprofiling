const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { PerformanceObserver, performance } = require('perf_hooks');
const profiler = require('v8-profiler-node8');
const v8Profiler = require("v8-profiler-next");
const start = v8Profiler.startProfiling("cpuprofile");
const title = 'aidtaas_02';
// console.profile();
// const startTime = performance.now();



// set generateType 1 to generate new format for cpuprofile
// to be compatible with cpuprofile parsing in vscode.
v8Profiler.setGenerateType(1);

// ex. 5 mins cpu profile
v8Profiler.startProfiling(title, true);
setTimeout(() => {
    const profile = v8Profiler.stopProfiling(title);
    profile.export(function (error, result) {

        (async function startScrapping() {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.setViewport({
                width: 1280,
                height: 716,
                deviceScaleFactor: 1,
            });

            const targetUrl = 'https://aidtaas.com/';

            await page.goto(targetUrl);

            // Start profiling for fetching clickable elements
            // console.time('Fetch  Elements');



            const usedMemoryBefore = process.memoryUsage().heapUsed;
            // console.log("usedMemoryBefore", usedMemoryBefore);

            // Start CPU profiling
            // profiler.startProfiling('startScrapping', true);

            // Start measuring execution time


            const elementsInfo = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a, button, div')).map(element => {
                    return {
                        tagName: element.tagName,
                        attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`),
                        textContent: element.textContent.trim(),
                    };
                });
            });

            // Stop CPU profiling
            // const profile = profiler.stopProfiling('startScrapping');
            // const cpuProfileString = JSON.stringify(profile.export());
            // console.log('CPU Profile:', cpuProfileString);


            // const profile = profiler.stopProfiling('startScrapping');

            // Save the CPU profile to a file
            // const cpuProfileFilePath = 'cpu-profile.cpuprofile';
            // profiler.writeSnapshot(cpuProfileFilePath);
            // console.log(cpuProfileFilePath)

            // Stop measuring execution time and calculate duration





            // const usedMemoryAfter = process.memoryUsage().heapUsed;
            // const memoryUsageInMB = (usedMemoryAfter - usedMemoryBefore) / (1024 * 1024);
            // console.log(`Memory usage during runtime: ${memoryUsageInMB.toFixed(2)} MB`);
            // console.profileEnd("hello");







            await browser.close();
        })();


        // fs.writeFile("testText.txt", arr.join("\n"));
        fs.writeFile(`${title}.cpuprofile`, result);
        console.log(`${title}.cpuprofile`, result);
        profile.delete();
    });
}, 1000);






