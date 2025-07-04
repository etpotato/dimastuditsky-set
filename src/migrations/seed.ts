import data from "./seed.json";
import { createClient, Environment } from "contentful-management";
import dotenv from "dotenv";
import { Track } from "../types";
dotenv.config();

async function seed() {
  try {
    const client = createClient({
      accessToken: process.env.CTFL_CMA_TOKEN as string,
    });
    const space = await client.getSpace(process.env.CTFL_SPACE_ID as string);
    const environment = await space.getEnvironment("master");

    for (const track of data.tracks) {
      await createTrack({ environment, track });
    }

    for (const group of data.groups) {
      const trackGroup = await Promise.all(
        group.map((track) => createTrack({ environment, track }))
      );

      await createTrackGroup({
        environment,
        title: group[0].title,
        trackIds: trackGroup.map((track) => track.sys.id),
      });
    }

    console.log("Content seeded successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

seed();

async function createTrack({
  environment,
  track,
}: {
  environment: Environment;
  track: Track;
}) {
  const created = await environment.createEntry("track", {
    fields: {
      title: {
        "en-US": track.title,
      },
      description: {
        "en-US": track.description,
      },
      url: {
        "en-US": track.url,
      },
      duration: {
        "en-US": track.duration,
      },
      artwork_url: {
        "en-US": track.artwork_url,
      },
      created_at: {
        "en-US": track.created_at,
      },
    },
  });

  const published = await created.publish();

  console.log(`Track "${track.title}" created with ID: ${created.sys.id}`);

  return published;
}

async function createTrackGroup({
  environment,
  title,
  trackIds,
}: {
  environment: Environment;
  title: string;
  trackIds: string[];
}) {
  const created = await environment.createEntry("trackGroup", {
    fields: {
      title: {
        "en-US": title,
      },
      tracks: {
        "en-US": trackIds.map((id) => ({
          sys: { type: "Link", linkType: "Entry", id },
        })),
      },
    },
  });

  await created.publish();

  console.log(`Track Group "${title}" created with ID: ${created.sys.id}`);
}
