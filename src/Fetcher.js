export const fetchAndSplit = async (url, predicate = r => r) => {
    const dataList = [];
    await fetch(url, {cache: "no-cache"})
    .then(r => r.text())
    .then(result => {
        const rawData = result.split("\n");
        rawData.filter(predicate).forEach(rawRow => {
            const row = rawRow.split("|");
            dataList.push(row);
        });
    });
    return dataList;
};