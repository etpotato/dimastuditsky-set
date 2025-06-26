import { DynamoRepository } from "../services/repository";
import tracks from "./tracks-seed.json";
import { DYNAMO_TABLE_NAME, DYNAMO_KEY } from "../constants";
import { writeFile } from "node:fs/promises";

async function seed() {
  const repository = new DynamoRepository(DYNAMO_TABLE_NAME);

  await repository.deleteAll();

  console.log("existing", await repository.getAll());

  for (const track of tracks) {
    try {
      await repository.save({ ...track, ...DYNAMO_KEY });
      console.log(`Track ${track.id} saved successfully.`);
    } catch (error) {
      console.error(`Error saving track ${track.id}:`, error);
    }
  }
}

// seed();

async function getAll() {
  const repository = new DynamoRepository(DYNAMO_TABLE_NAME);

  const response = await repository.getAll(10);

  await writeFile("./get-all-response.json", JSON.stringify(response, null, 2));
}

getAll();
