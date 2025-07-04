import { LambdaFunctionURLEvent, Context, Callback } from "aws-lambda";
import { Repository } from "../services/repository";
import { Html } from "../services/html";
import { TrackSource } from "../types";

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
      const source =
        event.queryStringParameters?.source &&
        Object.values(TrackSource).includes(
          event.queryStringParameters.source as TrackSource
        )
          ? (event.queryStringParameters.source as TrackSource)
          : undefined;

      const trackList = await this.repository.getTrackList(source);
      const htmlResponse = await this.htmlService.renderTrackList(
        trackList,
        source
      );

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
