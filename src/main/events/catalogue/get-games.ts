import type { CatalogueEntry } from "@types";

import { registerEvent } from "../register-event";
import { steamGamesWorker } from "@main/workers";
import { steamUrlBuilder } from "@shared";

const getGames = async (
  _event: Electron.IpcMainInvokeEvent,
  take = 12,
  cursor = 0
): Promise<{ results: CatalogueEntry[]; cursor: number }> => {
  const steamGames = await steamGamesWorker.run(
    { limit: take, offset: cursor },
    { name: "list" }
  );

  return {
    results: steamGames.map((steamGame) => ({
      title: steamGame.name,
      shop: "steam",
      cover: steamUrlBuilder.library(steamGame.id),
      objectID: steamGame.id,
    })),
    cursor: cursor + steamGames.length,
  };
};

registerEvent("getGames", getGames);
