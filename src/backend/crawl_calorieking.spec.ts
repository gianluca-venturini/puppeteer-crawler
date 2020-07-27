import { handler } from "./crawl_calorieking";


describe('Crawl', () => {

    it('crawl Calorieking', async () => {
        const event = {
            queryStringParameters: { test: 123 }
        } as any;

        const result = await handler(event, null as any);

        expect(JSON.parse(result.body)).toEqual({ 
            fat: '0',
            carbs: '80',
            fiber: '1.1',
            protein: '6.7',
        });
    });
    
});