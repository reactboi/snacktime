export const fetchAndSplit = async (url, predicate = r => r.includes('|')) => {
    const dataList = [];
    await fetch(url, {cache: "no-cache"})
    .then(r => r.text())
    .then(result => {
        result = result.replace('\r', '');
        const rawData = result.split("\n");
        rawData
        .filter((row) => !row.startsWith('#'))
        .filter(predicate)
        .forEach(rawRow => {
            const row = rawRow.split("|");
            dataList.push(row);
        });
    });
    return dataList;
};