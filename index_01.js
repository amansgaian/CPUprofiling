const puppeteer = require('puppeteer');

(async () => {
    const url = "aidtaas.com/";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 716,
        deviceScaleFactor: 1,
    })
    await page.goto(`https://${url}`);
    console.log(page.url());

    // Access the Chrome DevTools Protocol (CDP) through Puppeteer
    const client = await page.target().createCDPSession();
    console.log(client, "CLIENT");
    // Now you can use the 'client' to send CDP commands and receive responses
    // For example, you can enable DOM and query the document:
    await client.send('DOM.enable');
    const { root } = await client.send('DOM.getDocument');

    console.log(root);
    console.log('Root Node Name:', root.nodeName);



    console.log('Children of the root node:', root.children);
    console.log('Attributes of the <html> element:', root.children[1].attributes);

    roo

    // Close the browser when done
    await browser.close();
})();
