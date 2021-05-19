export const numberToWeekDay = (number) => {
    switch(number) {
        case 0:
            return "søndag";
        case 1:
            return "mandag";
        case 2:
            return "tirsdag";
        case 3:
            return "onsdag";
        case 4: 
            return "torsdag";
        case 5:
            return "fredag";
        case 6:
            return "lørdag";
        default:
            return "denne ukedagen finnes ikke, morroklumpen";
    }
}