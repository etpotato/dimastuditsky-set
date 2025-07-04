import { Context, Callback, LambdaFunctionURLEvent } from "aws-lambda";
import dotenv from "dotenv";
import { ApiHandler } from "./handlers/api-handler";
import { HtmlService } from "./services/html";
import { ContentfulRepository } from "./services/repository/contentful/contentful-repository";

dotenv.config();

const repository = new ContentfulRepository(
  process.env.CTFL_CDA_TOKEN as string,
  process.env.CTFL_SPACE_ID as string
);
const htmlService = new HtmlService();
const apiHandler = new ApiHandler(repository, htmlService);

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
