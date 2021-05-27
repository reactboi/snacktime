export const createDateFromString = (dateString) => {
    
    const date = new Date(dateString);
    if(isNaN(date.getTime())) {
        console.log(`The date ${dateString} is not a valid one, sorry`);
        throw ReferenceError(`The date ${dateString} is not a valid one, sorry`);
    }
    return date;
};