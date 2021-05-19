import { getRotatingIndex } from "./get-rotating-index";
import { isPlayerInTheGame } from "./is-player-in-the-game";

export const getNextValidPlayerForDate =(date, protoPlayerIndex, playerList) => {
    let playerIndex = protoPlayerIndex
    let player = playerList[playerIndex];
    while(!isPlayerInTheGame(player, date)) {
        playerIndex = getRotatingIndex(playerIndex, playerList.length);
        player = playerList[playerIndex];
    }

    return playerIndex;
};