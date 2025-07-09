import { MigrationFunction, runMigration } from "contentful-migration";
import dotenv from "dotenv";
dotenv.config();

const REGEX_URL =
  "^(https?:\\/\\/)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(\\/[^\\s]*)?$";

const migrationFunction: MigrationFunction = (migration, context) => {
  try {
    const trackContentType = migration.createContentType("track", {
      name: "Track",
    });

    const title = trackContentType.createField("title", {
      name: "Title",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [],
    });

    trackContentType.displayField(title.id);

    trackContentType.createField("description", {
      name: "Description",
      type: "Text",
      required: false,
      localized: false,
      validations: [],
    });

    trackContentType.createField("duration", {
      name: "Full Duration Sec",
      type: "Integer",
      required: true,
      localized: false,
      validations: [
        {
          range: { min: 0 },
          message: "Must be a positive integer",
        },
      ],
    });

    trackContentType.createField("created_at", {
      name: "Created At",
      type: "Date",
      required: true,
      localized: false,
      validations: [],
    });

    trackContentType.createField("artwork_url", {
      name: "Artwork URL",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          regexp: {
            pattern: REGEX_URL,
            flags: "i",
          },
          message: "Must be a valid image URL",
        },
      ],
    });

    trackContentType.createField("url", {
      name: "URL",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [
        {
          regexp: {
            pattern: REGEX_URL,
            flags: "i",
          },
          message: "Must be a valid URL",
        },
      ],
    });

    const trackGoupContentType = migration.createContentType("trackGroup", {
      name: "Track Group",
    });

    const trackGoupTitle = trackGoupContentType.createField("title", {
      name: "Title",
      type: "Symbol",
      required: true,
      localized: false,
      validations: [],
    });
    trackGoupContentType.displayField(trackGoupTitle.id);

    trackGoupContentType.createField("tracks", {
      name: "Tracks",
      type: "Array",
      items: {
        type: "Link",
        linkType: "Entry",
        validations: [
          {
            linkContentType: ["track"],
          },
        ],
      },
      required: true,
      localized: false,
      validations: [],
    });

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
};

try {
  runMigration({
    migrationFunction,
    accessToken: process.env.CTFL_CMA_TOKEN as string,
    spaceId: process.env.CTFL_SPACE_ID as string,
  });
} catch (error) {
  console.error("Error in top:", error);
  throw error;
}
