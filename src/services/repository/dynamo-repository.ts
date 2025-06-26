import { DescribeTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Track, TrackList } from "../../types";
import { Repository } from "./repository-interface";

export class DynamoRepository implements Repository {
  private db: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    this.db = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async getAll(limit: number = 100, next?: string): Promise<TrackList> {
    const [result, table] = await Promise.all([
      this.db.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: "GSI1PK-created_at-index",
          KeyConditionExpression: "GSI1PK = :pk",
          ExpressionAttributeValues: { ":pk": "TRACKS" },
          ScanIndexForward: false, // descending order by SK (created_at)
          Limit: limit,
          ...(next && {
            ExclusiveStartKey: {
              GSI1PK: "TRACKS",
              created_at: next,
            },
          }),
        })
      ),
      this.db.send(new DescribeTableCommand({ TableName: this.tableName })),
    ]);

    return {
      items: result.Items as Track[],
      total: table.Table?.ItemCount || 0,
      next: result.LastEvaluatedKey?.created_at,
    };
  }

  async save(track: Track) {
    await this.db.send(
      new PutCommand({
        TableName: this.tableName,
        Item: track,
      })
    );
  }

  async deleteAll() {
    const { items } = await this.getAll();

    // Dynamo supperts batch writes with a maximum of 25 items per request.
    for (let i = 0; i < items.length; i += 25) {
      const batch = items.slice(i, i + 25);

      if (batch.length === 0) continue;

      await this.db.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.tableName]: batch.map((item) => ({
              DeleteRequest: {
                Key: { id: item.id, created_at: item.created_at },
              },
            })),
          },
        })
      );
    }
  }
}
