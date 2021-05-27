export const fetchAndSplit = async (url, predicate = r => r.includes('|')) => {
    const dataList = [];
    await fetch(`config/${url}`, {cache: "no-cache"})
    .then(r => r.text())
    .then(result => {
        const rawData = result.split(/\r?\n/);
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