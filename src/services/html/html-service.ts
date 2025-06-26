import { readFile } from "node:fs/promises";
import { Html } from "./html-interface";
import { TrackList } from "../../types";

const HTML_PATH = "assets/index.html";

export class HtmlService implements Html {
  public async renderTrackList(trackList: TrackList) {
    const template = await readFile(HTML_PATH, "utf-8");

    const tracksHtml = `
      <ol class="list">
        ${trackList.items
          .map((track) => {
            // hh:mm:ss
            const duration_sec = track.full_duration / 1000;
            const duration =
              Math.floor(duration_sec / 3600)
                .toString()
                .padStart(2, "0") +
              ":" +
              Math.floor((duration_sec % 3600) / 60)
                .toString()
                .padStart(2, "0") +
              ":" +
              Math.floor(duration_sec % 60)
                .toString()
                .padStart(2, "0");

            return `
          <li class="item">
            <a class="wrap link" href="${track.permalink_url}" target="_blank">
              <img width="200" height="200" class="img" src="${
                track.artwork_url
              }"/>
              <div class="text">
                <h3 class="title">${track.title}</h3>
                <p>${new Date(track.created_at).toDateString().slice(4)}</p>
                <p>Duration: ${duration}</p>
              </div>
            </a>
          </li>
        `;
          })
          .join("")}
      </ol>
      <style>
        .list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .item {
          position: relative;
          margin: 0;
          padding: 20px 0;
        }

        .item::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: currentColor;
        }

        .item:last-child::before {
          content: none;
        }

        .wrap {
          display: flex;
          gap: 20px;
        }

        .link {
          text-decoration: none;
          color: inherit;
        }

        .img {
          display: block;
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .title {
          margin: 0;
          margin-bottom: 10px;
        }

        .text p {
          margin: 0;
          margin-bottom: 5px;
        }

        .text p:last-child {
          margin-bottom: 0;
        }
      </style>
    `;

    return template.replace("{{data}}", tracksHtml);
  }
}
