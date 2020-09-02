import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as puppeteer from 'puppeteer-core';
import * as chromium from 'chrome-aws-lambda';
import * as Lru from 'lru-cache';

interface Stats {
    fat: number | string;
    carbs: number | string;
    fiber: number | string;
    protein: number | string;
    satFat: number | string;
    polyUnsatFat: number | string;
    monoUnsatFat: number | string;
    sugars: number | string;
}

const cache = new Lru<string, Stats>({
    max: 10_000,
    maxAge: 1000 * 60 * 60 * 24
});

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log('event', event);
    const queries = event.queryStringParameters;

    if (!queries || !queries.url) {
        return {
            statusCode: 400,
            body: 'Did you forget `url`?'
        }
    }

    const url = queries.url;
    let stats = cache.get(url);

    if (!stats) {
        console.log('start', JSON.stringify(event.queryStringParameters));

        const browser = await puppeteer.launch({
            executablePath: await chromium.executablePath,
            args: chromium.args,
            defaultViewport: { width: 400, height: 3000 }, // necessary to include all the params in the visible part of the screen
            headless: chromium.headless
        });
        const page = await browser.newPage();
        await page.goto(url);

        await mouseDownElement(page, '//div[./p[text() = "Serving"]]/div/div');
        await clickElement(page, '//li[text()="g"]');
        await inputElement(page, '//div[./p[text()="Quantity"]]//input', '100');
        // await new Promise(resolve => setTimeout(() => resolve(), 10));

        await page.waitForXPath('//tr[./th/span[text()="Fat"]]/td/span');
        const fat = await getTextElement(page, '//tr[./th/span[text()="Fat"]]/td/span');
        const carbs = await getTextElement(page, '//tr[./th/span[text()="Carbs"]]/td/span');
        const fiber = await getTextElement(page, '//tr[./th/span[text()="Fiber"]]/td/span');
        const protein = await getTextElement(page, '//tr[./th/span[text()="Protein"]]/td/span');
        const satFat = await getTextElement(page, '//tr[./th/a[text()="Saturated Fat"]]/td');
        const polyUnsatFat = await getTextElement(page, '//tr[./th/a[text()="Polyunsaturated Fat"]]/td');
        const monoUnsatFat = await getTextElement(page, '//tr[./th/a[text()="Monounsaturated Fat"]]/td');
        const sugars = await getTextElement(page, '//tr[./th/a[text()="Sugars"]]/td');

        stats = {
            fat,
            carbs,
            fiber,
            protein,
            satFat,
            polyUnsatFat,
            monoUnsatFat,
            sugars
        }
        cache.set(url, stats);
    } else {
        console.log('Stats retrieved from cache');
    }

    return {
        statusCode: 200,
        body: JSON.stringify(stats)
    }
}

async function mouseDownElement(page: puppeteer.Page, xSelector: string) {
    console.log('mouseDownElement', xSelector);
    const clickElements = await page.$x(xSelector);

    await clickElements[0].evaluate(n => {
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        n.dispatchEvent(clickEvent);
    });
}

async function clickElement(page: puppeteer.Page, xSelector: string) {
    console.log('clickElement', xSelector);
    const clickElements = await page.$x(xSelector);

    await clickElements[0].click();
}

async function inputElement(page: puppeteer.Page, xSelector: string, text: string) {
    console.log('inputElement', xSelector, text);
    const elements = await page.$x(xSelector);

    await elements[0].focus();

    // Clear the field first
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');
    await page.keyboard.press('Backspace');

    // Type the chars
    await page.keyboard.type(text);
}

async function getTextElement(page: puppeteer.Page, xSelector: string) {
    console.log('getTextElement', xSelector);
    const elements = await page.$x(xSelector);
    const text = await elements[0]?.evaluate(n => n.childNodes[0].textContent);
    if (text === '< 0.1 g' || text === '< 0.1') {
        return 0;
    }
    if (!text) {
        return 'N/A';
    }
    return parseFloat(text);
}
