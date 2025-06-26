import { LambdaFunctionURLEvent, Context, Callback } from "aws-lambda";
import { Repository } from "../services/repository";
import { Html } from "../services/html";

export class ApiHandler {
  constructor(
    private readonly repository: Repository,
    private readonly htmlService: Html
  ) {}

  public async handleGet(
    event: LambdaFunctionURLEvent,
    context: Context,
    callback: Callback
  ) {
    try {
      const trackList = await this.repository.getAll();
      const htmlResponse = await this.htmlService.renderTrackList(trackList);
      callback(null, {
        statusCode: 200,
        body: htmlResponse,
        headers: {
          "Content-Type": "text/html",
        },
      });
    } catch (error) {
      console.error("Error retrieving data:", error);

      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ message: "Error retrieving data" }),
      });
    }
  }
}
