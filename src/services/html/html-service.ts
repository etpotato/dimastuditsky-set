import { readFile } from "node:fs/promises";
import { Html } from "./html-interface";
import { Track, TrackList, TrackSource } from "../../types";

const HTML_PATH = "assets/index.html";

export class HtmlService implements Html {
  public async renderTrackList(trackList: TrackList, source?: TrackSource) {
    const template = await readFile(HTML_PATH, "utf-8");

    const trackIdsFromGroups = new Set(
      trackList.groups.flat(2).map((track) => track.id)
    );
    const tracksWithoutGroups = trackList.tracks.filter(
      (track) => !trackIdsFromGroups.has(track.id)
    );

    const groups: Array<Array<Track>> = [];

    for (const group of trackList.groups) {
      const groupIds = new Set(group.map((track) => track.id));
      const tracksInGroup = trackList.tracks
        .filter((track) => groupIds.has(track.id))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (tracksInGroup.length > 0) {
        groups.push(tracksInGroup);
      }
    }

    const tracks = [...tracksWithoutGroups, ...groups].sort(
      (a, b) =>
        (Array.isArray(b)
          ? new Date(b[0].created_at).getTime()
          : new Date(b.created_at).getTime()) -
        (Array.isArray(a)
          ? new Date(a[0].created_at).getTime()
          : new Date(a.created_at).getTime())
    );

    const tracksHtml = `
      <header>
        <nav class="chips-wrap">
          <a class="chip ${!source ? "active" : ""}" href="/">all</a>
          ${Object.values(TrackSource)
            .map(
              (sourceType) => `
            <a class="chip ${
              source === sourceType ? "active" : ""
            }" href="?source=${sourceType}">${sourceType}</a>
          `
            )
            .join("")}
        </nav>
      </header>
      <main>
        <ol class="list">
          ${tracks
            .map((track) => {
              return `
            <li class="item">
              ${
                Array.isArray(track)
                  ? track.map((t) => this.getItemContent(t)).join("")
                  : this.getItemContent(track)
              }
            </li>
          `;
            })
            .join("")}
        </ol>
      <main>
      <style>
        .chips-wrap {
          padding-top: 20px;
          display: flex;
          gap: 10px;
        }

        .chip {
          padding: 5px 10px;
          border: 1px solid currentColor;
          border-radius: 100em;
          color: inherit;
          font-weight: 300;
          text-decoration: none;
        }

        .chip.active {
          color: blue;
        }

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
          position: relative;
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding-right: 20px;
        }

        .wrap:last-child {
          margin-bottom: 0;
        }

        .link {
          text-decoration: none;
          color: inherit;
        }

        .img {
          display: block;
          width: 100px;
          height: 100px;
          object-fit: cover;
          object-position: center;
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

        .icon {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 20px;
          height: 20px;
        }
      </style>
    `;

    return template.replace("{{data}}", tracksHtml);
  }

  private getItemContent(track: Track) {
    const duration =
      Math.floor(track.duration / 3600)
        .toString()
        .padStart(2, "0") +
      ":" +
      Math.floor((track.duration % 3600) / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      Math.floor(track.duration % 60)
        .toString()
        .padStart(2, "0");

    const svgIconId = track.url.includes("youtube")
      ? "icon-youtube"
      : "icon-soundcloud";

    return `
      <a class="wrap link" href="${track.url}" target="_blank">
        <img width="200" height="200" class="img" src="${track.artwork_url}"/>
        <div class="text">
          <h3 class="title">${track.title}</h3>
          <p>${new Date(track.created_at).toDateString().slice(4)}</p>
          <p>Duration: ${duration}</p>
        </div>
        <svg class="icon">
          <use href="#${svgIconId}"></use>
        </svg>
      </a>
    `;
  }
}
