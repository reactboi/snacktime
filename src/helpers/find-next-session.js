import { formatDate } from "./format-date";

    export const findNextSession = (fromDate, order) => {
        let previousDate = new Date('1970-01-01');
            
        for(let i=0;i<order.length;i++) {
            let [,date] = order[i];
            if(formatDate(fromDate) === formatDate(date)) {
                return i;
            }

            if(fromDate.getTime() > previousDate.getTime() && fromDate.getTime() < date.getTime()) {
                return i;
            }
            previousDate = new Date(date);
        }
        return null;
    };