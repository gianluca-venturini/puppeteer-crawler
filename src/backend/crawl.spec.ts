import { handler } from "./crawl";


describe('Crawl', () => {

    it('crawl Calorieking', () => {
        const event = {
            queryStringParameters: { test: 123 }
        } as any;
        handler(event, null as any);
    });
    
});