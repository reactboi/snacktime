export const isPlayerInTheGame = (player, currentDate) => {
    return player[1].getTime() <= currentDate.getTime() && player[2].getTime() >= currentDate.getTime();
};