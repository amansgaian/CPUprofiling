const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { PerformanceObserver, performance } = require('perf_hooks');
const profiler = require('v8-profiler-node8');
const v8Profiler = require("v8-profiler-next");
const start = v8Profiler.startProfiling("cpuprofile");
const title = 'aidtaas_06';

// Initialize arrays to store timestamps and time intervals
const samples = [];
const time_deltas = [];

// set generateType 1 to generate a new format for cpuprofile
// to be compatible with cpuprofile parsing in vscode.
v8Profiler.setGenerateType(1);

// ex. 5 mins cpu profile
v8Profiler.startProfiling(title, true);

// Capture timestamps and time intervals for each function call
const originalFunction = performance.timeOrigin;
performance.timeOrigin = function () {
    const time = originalFunction.call(performance);
    samples.push(time);
    if (samples.length > 1) {
        time_deltas.push(time - samples[samples.length - 2]);
    }
    return time;
};

setTimeout(() => {
    performance.timeOrigin = originalFunction;
    const profile = v8Profiler.stopProfiling(title);

    // Initialize a dictionary to store profiling times for each function
    const profiling_times = {};

    // Calculate profiling times for each function call
    for (let i = 0; i < samples.length; i++) {
        const function_timestamp = samples[i];
        const delta_time = time_deltas[i];

        // Calculate profiling time for the current function call
        const profiling_time = function_timestamp + delta_time;

        // Optionally, get the function name from the data and use it as the key
        const function_name = "Function Name"; // Replace this with the actual function name from data

        // Store the profiling time in the dictionary, associated with the function name
        profiling_times[function_name] = profiling_time;
    }

    console.log("Profiling Times:", profiling_times);

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

            const elementsInfo = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a, button, div')).map(element => {
                    return {
                        tagName: element.tagName,
                        attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`),
                        textContent: element.textContent.trim(),
                    };
                });
            });

            // console.log(`${title}.cpuprofile`, result);
            fs.writeFile(`${title}.cpuprofile`, result);


            await browser.close();
        })();

        // fs.writeFile("testText.txt", arr.join("\n"));
        profile.delete();
    });
}, 5000);
