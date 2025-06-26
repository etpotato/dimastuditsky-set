import { Context, Callback, LambdaFunctionURLEvent } from "aws-lambda";
import { ApiHandler } from "./handlers/api-handler";
import { DynamoRepository } from "./services/repository";
import { DYNAMO_TABLE_NAME } from "./constants";
import { HtmlService } from "./services/html";

const dynamoRepository = new DynamoRepository(DYNAMO_TABLE_NAME);
const htmlService = new HtmlService();
const apiHandler = new ApiHandler(dynamoRepository, htmlService);

export const handler = (
  event: LambdaFunctionURLEvent,
  context: Context,
  callback: Callback
) => {
  if (event.requestContext.http.method === "GET") {
    apiHandler.handleGet(event, context, callback);

    return;
  }

  callback(null, {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  });
};
