import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as puppeteer from 'puppeteer';


export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    // const queries = JSON.stringify(event.queryStringParameters);
    // const { url, encodedSelectors } = queries;
    // const selectors = decodeURIComponent(encodedSelectors);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 2000 });
    await page.goto('https://www.calorieking.com/us/en/foods/f/calories-in-rice-arborio-rice-uncooked/jyPc0MwBR5SCiBKCgc17uw');

    await mouseDownElement(page, '//div[./p[text() = "Serving"]]/div/div');
    await clickElement(page, '//li[@data-value="2" and text()="g"]');
    await inputElementAppend(page, '//div[./p[text() = "Quantity"]]//input', '100'); // Final text "100"
    await new Promise(resolve => setTimeout(() => resolve(), 1000));
    
    await page.waitForXPath('//tr[./th/span[text()="Fat"]]/td/span');
    const fat = await getTextElement(page, '//tr[./th/span[text()="Fat"]]/td/span');
    const carbs = await getTextElement(page, '//tr[./th/span[text()="Carbs"]]/td/span');
    const fiber = await getTextElement(page, '//tr[./th/span[text()="Fiber"]]/td/span');
    const protein = await getTextElement(page, '//tr[./th/span[text()="Protein"]]/td/span');

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({
            fat,
            carbs,
            fiber,
            protein
        })
    }
}

async function mouseDownElement(page: puppeteer.Page, xSelector: string) {
    const clickElements = await page.$x(xSelector);

    await clickElements[0].evaluate(n => {
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        n.dispatchEvent(clickEvent);
    });
}

async function clickElement(page: puppeteer.Page, xSelector: string) {
    const clickElements = await page.$x(xSelector);

    await clickElements[0].click();
}

async function inputElementAppend(page: puppeteer.Page, xSelector: string, text: string) {
    const elements = await page.$x(xSelector);

    await elements[0].focus();

    // Clear the field first
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');
    await page.keyboard.press('Backspace');

    // Type the chars
    await page.keyboard.type(text, {delay: 100});
}

async function getTextElement(page: puppeteer.Page, xSelector: string) {
    const elements = await page.$x(xSelector);
    return await elements[0].evaluate(n => n.childNodes[0].textContent);
}
