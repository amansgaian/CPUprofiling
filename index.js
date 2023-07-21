
const puppeteer = require("puppeteer");
const fs = require("fs");
// const { getEventListeners } = require('events');

async function start() {
    const url = "aidtaas.com/";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 716,
        deviceScaleFactor: 1,
    })
    // const page = await browser.newPage();
    // await page.setViewport({
    //     width: 1280,
    //     height: 716,
    //     deviceScaleFactor: 1,
    // })
    await page.goto(`https://${url}`);
    console.log(page.url());

    await page.setRequestInterception(true);

    const back = async () => {
        await page.goBack();
    }

    page.on("request", (request) => {
        // Abort navigation or reload requests
        // if(request.url().endsWith(url)){
        //   request.continue();
        // }
        if (
            request.isNavigationRequest() && !request.url().endsWith(url)
        ) {
            request.continue();
            setTimeout(() => {
                back();
            }, 1000)
            console.log(request.url());
            console.log("Page navigation or reload aborted");
        } else {
            request.continue();
            console.log("Page navigation or reload continued");

        }
    });
    // console.log("before navigation");
    // const solutions = await page.waitForSelector(
    //   "#header_contents__BPVm0 > div:nth-child(2) > div:nth-child(1)"
    // );
    // await solutions.click();
    // const hrPeopleTech = await page.waitForSelector(
    //   "#menu_content__jKQUB > li"
    // );
    // await hrPeopleTech.click();
    // console.log("reached");
    // setTimeout(()=>{
    const solutions = "#header_contents__BPVm0 > div:nth-child(2) > div:nth-child(1)";
    const hrPeopleTech = "#menu_content__jKQUB > li";

    await page.click(solutions);
    await page.click(hrPeopleTech);
    await page.waitForNavigation();
    await page.click(solutions);

    // await page.waitForNavigation();
    // const solutions2 = await page.waitForSelector(
    //   "#header_contents__BPVm0 > div:nth-child(2) > div:nth-child(1)"
    // );
    // await solutions2.click();
    // await console.log("before reload");
    // await page.reload();
    // }, 5000)
    // await browser.close();
}

start();


