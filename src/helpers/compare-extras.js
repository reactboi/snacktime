export const compareExtras = (extra) => {
    if(extra.includes('skip')) {
        return 'skip';
    }

    if(extra.includes('extra')) {
        return 'extra';
    }

    return null;
};