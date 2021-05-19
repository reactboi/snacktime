import { getNextValidPlayerForDate } from "./get-next-valid-player-for-date";
import { getRotatingIndex } from "./get-rotating-index";

export const joinNamesAndDates = (players, dates) => {
    if(players.length === 0 || dates.length === 0) {
        return [];
    }
    
    const maxSize = players.length;
    const finalList = [];

    let playerIndex = 0;
    for(let date of dates) {
        playerIndex = getNextValidPlayerForDate(date, playerIndex, players);

        finalList.push([playerIndex, date])
        playerIndex = getRotatingIndex(playerIndex, maxSize);
    }

    return finalList;
};