export const generateDefaultPlaydays = (fromDate, toDate, dayOfWeek) => {
    const date = new Date(fromDate);

    if(dayOfWeek > 6) {
        throw RangeError("Day of week not valid!");
    }

    // eslint-disable-next-line eqeqeq
    while (date.getDay() != dayOfWeek) {
        date.setDate(date.getDate() + 1);
    }

    const dates = [];
    while(date.getTime() < toDate.getTime()) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 7);
    }

    return dates;
}