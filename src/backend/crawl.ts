import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import * as puppeteer from 'puppeteer';


export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const queries = JSON.stringify(event.queryStringParameters);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.calorieking.com/us/en/foods/f/calories-in-rice-arborio-rice-uncooked/jyPc0MwBR5SCiBKCgc17uw');
    await page.screenshot({path: 'example.png'});

    await browser.close();

    return {
        statusCode: 200,
        body: `Queries: ${queries}`
    }
}