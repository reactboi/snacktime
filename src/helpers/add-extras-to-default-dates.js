import { formatDate } from "./format-date";

export const addExtrasToDefaultDates = (defaultDateArray, extrasArray) => {
    const extras = extrasArray
        .filter(([, extra]) => extra === 'extra')
        .map(([d]) => d);

    const skipTimes = extrasArray
        .filter(([, extra]) => extra === 'skip')
        .map(([d]) => formatDate(d));
    
    const finalDates = [
        ...defaultDateArray,
        ...extras
    ];


    finalDates.sort((a, b) => a.getTime() - b.getTime());
    return finalDates.filter((d) => !skipTimes.includes(formatDate(d)));
};