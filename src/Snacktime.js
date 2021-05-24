import React, { useEffect, useState } from 'react';
import { fetchAndSplit } from './helpers/fetch-and-split';
import { compareExtras } from './helpers/compare-extras';
import { generateDefaultPlaydays } from './helpers/generate-default-playdays';
import { formatDate } from './helpers/format-date';
import { addExtrasToDefaultDates } from './helpers/add-extras-to-default-dates';
import { joinNamesAndDates } from './helpers/join-names-and-dates';
import { isPlayerInTheGame } from './helpers/is-player-in-the-game';
import { numberToWeekDay } from './helpers/number-to-weekday';
import { findNextSession } from './helpers/find-next-session';
import { getRotatingIndex } from './helpers/get-rotating-index';
import { getNextValidPlayerForDate } from './helpers/get-next-valid-player-for-date';

export const Snacktime = (props) => {

    const todayDate = new Date();
    const startDate = new Date(props.startDate);
    const endDate = new Date(props.startDate); 
    endDate.setDate(startDate.getDate()+1500);

    const [players, setPlayers] = useState([]);
    const [order, setOrder] = useState([]);
    const [orderIndex, setOrderIndex] = useState(0);
    const [extras, setExtras] = useState([]);
    const [columns, setColumns] = useState([]);
    const [defaultDates, setDefaultDates] = useState([]);
    const [nextPlayday, setNextPlayday] = useState(new Date('1970-01-01'));
    const [purchasers, setPurchasers] = useState([]);

    useEffect(() => {    
        setDefaultDates(generateDefaultPlaydays(startDate, endDate, props.dayOfWeek));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            const playerListRaw = await fetchAndSplit(`${props.folderPrefix}/players.txt`);
            
            const playerList = [];
            playerListRaw.forEach(playerRaw => {
                const player = [];
                player.push(playerRaw[0]);
                player.push(new Date(playerRaw[1]));
    
                if(playerRaw.length === 3) {
                    player.push(new Date(playerRaw[2]));
                }
                else {
                    player.push(new Date("2300-12-31"));
                }
                playerList.push(player);
            });
            setPlayers(playerList);
            
            const columnsRaw = await fetchAndSplit(`${props.folderPrefix}/columns.txt`, c => c.length !== 0 && !c.match(/^[\s|\t]+$/));
            
            setColumns(columnsRaw.map(([name, icon]) => icon === undefined ? [name, 'default.svg'] : [name, icon]));
            
            const extrasRaw = await fetchAndSplit(`${props.folderPrefix}/extras.txt`);

            setExtras(extrasRaw
                .map(([date, which]) => [new Date(date), compareExtras(which)])
                .filter(([, which]) => (which === 'skip' || which === 'extra')));
        // End of async-hack
        })(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const finalDates = addExtrasToDefaultDates(defaultDates, extras);
        setOrder(joinNamesAndDates(players, finalDates));
    }, [defaultDates, extras, players]);

    useEffect(() => {
        if(todayDate.getTime() < startDate.getTime() || order.length === 0) {
            return;
        }

        setCurrentSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    useEffect(() => {
        if(columns.length === 0 || players.length === 0 || order.length === 0) {
            return;
        }

        const [firstPurchaser, date] = order[orderIndex];
        const purchaserList = [[columns[0][0], firstPurchaser]];
        
        const columnsExceptFirst = columns.slice(1);
        
        let nextPurchaser = getRotatingIndex(firstPurchaser, players.length);
        for(let [c,] of columnsExceptFirst) {
            nextPurchaser = getNextValidPlayerForDate(
                date,
                nextPurchaser,
                players);
            purchaserList.push([c, nextPurchaser]);
            nextPurchaser = getRotatingIndex(nextPurchaser, players.length);
        }

        setPurchasers(purchaserList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderIndex, columns, players])

    const updateOrderIndex = (movement) => {
        const final = orderIndex+movement;

        if(final < 0 || final >= order.length) {
            alert('Du har nådd enten begynnelsen eller slutten av listen!');
            return;
        }
        setOrderIndex(final);
        setNextPlayday(order[final][1]);
    }

    const setCurrentSession = () => {
        const nextSesh = findNextSession(todayDate, order);
        setOrderIndex(nextSesh)
        setNextPlayday(order[nextSesh][1]);
    };

    const renderMethod = () => {    
        let header = <h2>{props.title}</h2>    
        // Ikke rukket å hente data.
        if(order.length === 0) {
            return (<div>
                {header}
                <div>Laster inn kalender</div>
            </div>)
        }
        
        // Kalenderen er over sluttdato.
        if(todayDate.getTime() > endDate.getTime()) {
            return (<div>
                {header}    
                <div>Kalenderen <strong>{props.title}</strong> har gått ut! Vennligst sett en ny dato</div>
            </div>);
        }

        if(todayDate.getTime() < startDate.getTime()) {
            return (<div>
                {header}
                <div>Kalenderen har ikke begynt ennå! Sett en tidligere startdato eller vent til den {formatDate(startDate)}</div>
            </div>)
        }
        
        // Tabell er klar
        return (<div className="container">
                <h2>{props.title}</h2>
                <div>Tabell for {numberToWeekDay(nextPlayday.getDay())} {formatDate(nextPlayday)}</div>
                <div>
                    <button onClick={() => updateOrderIndex(-1)}>Forrige</button>
                    <button onClick={() => setCurrentSession()}>Nærmeste</button>
                    <button onClick={() => updateOrderIndex(1)}>Neste</button>
                </div>
                <table id="snacktable" border="1">
                    <th>#</th>
                    {columns.map(([col,index]) => {
                        return (<th key={index}>{col}</th>)
                    })}
                    {players.map((player, index) => {
                        if(!isPlayerInTheGame(player, order[orderIndex][1])) {
                            return null;
                        }
                        return (<tr key={player[0]}>
                            <td>{player[0]}</td>
                            {columns.map(([col,icon]) => {
                                let fill = <img src='/images/none.png' alt='no man' className='iconContainer' />;
                                if(purchasers.find((p) => p[1] === index && col === p[0])) {
                                    fill = <img src={`/images/${icon}`} alt={col} className='iconContainer' />;
                                }
                                return (<td key={col}>{fill}</td>)
                            })}
                        </tr>)
                    })}
                </table>
        </div>);
    };

    return renderMethod();
};