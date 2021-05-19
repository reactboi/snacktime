export const getRotatingIndex = (currentIndex, listLength) => {
    currentIndex++;
    if(currentIndex === listLength) {
        currentIndex = 0;
    }
    return currentIndex;
}