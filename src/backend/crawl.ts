import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";

module.exports.handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const queries = JSON.stringify(event.queryStringParameters);
    return {
        statusCode: 200,
        body: `Queries: ${queries}`
    }
}