import React from 'react';

import check from './check.svg';

import './Snacktime.css';
import { fetchAndSplit } from './Fetcher';

// TODO: Vi trenger "Skip datoer" og muligens "ekstra datoer"
class Snacktime2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            todayDate: new Date(),
            endDate: new Date("2022-01-01"),
            order: [],
            columns: []
        }
    }


    // Her henter vi listen over spillere, og lager rekkefølgen. 
    componentDidMount() {
        this.fetchPlayers();
        this.fetchColumns();
    }

    async fetchPlayers() {
        const playerListRaw = await fetchAndSplit(this.props.players, p => p.includes("|"));
            
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
        this.setState({ 
            players: playerList,
            order: this.generateWhoseTurnItIs(playerList)
        });
    }

    async fetchColumns() {
        const columns = await fetchAndSplit(this.props.columns, c => c.length !== 0 && c.length !== 1);
        this.setState({ columns: columns.map(([one, two]) => one) });
    }

    generateWhoseTurnItIs(playerList) {
        const startDate = this.getNextPlayday(new Date(this.props.startDate));
        const endDate = new Date(this.state.endDate);

        const allPlayers = [...playerList];
        
        const orderBuying = [];
        // Må vente på at spillere rekker å lastes inn. Det er sannsynligvis en bedre metode. 
        if(allPlayers.length === 0) {
            return;
        }

        // Her looper vi fra startDato til sluttDato. Disse er definert, og ikke bare et år, så vi slipper å bruke ukenummer eller oppdatere hvert nyår. 
        const loopDate = new Date(startDate);
        let playerIndex = 0;
        while(loopDate.getTime() < endDate.getTime()) {
            let update = false;
            const currentPlayer = allPlayers[playerIndex];
            if(this.isPlayerInTheGame(currentPlayer, loopDate)) {
                orderBuying.push([new Date(loopDate), playerIndex]);
                update = true;
            } 

            if(playerIndex === allPlayers.length -1) {
                playerIndex = 0;
            } else {
                playerIndex++;
            }

            // Vi lar den kun gå videre til neste dato når den har funnet en gyldig id.  
            if(update) {
                loopDate.setDate(loopDate.getDate()+7);
            }
        }
        return orderBuying;
    }

    whoseTurn(inputDate) {
        const date = this.getNextPlayday(inputDate);

        // Igjen med denne "vente"-greia
        if(this.state.order.length === 0) {
            return null;
        }
        
        // Her må vi konvertere datoen til et sammenlignbart format. Vi kan ikke bruke getTime() når vi ikke er sikre på at tiden blir rett. Muligens en bedre måte her også 
        return this.state.order.filter(current => this.formatDate(date) === this.formatDate(current[0]))[0];
    }

    getNextPlayday(inputDate) {
        const date = new Date(inputDate);
        const dayOfWeek = parseInt(this.props.dayOfWeek);

        if(dayOfWeek > 6) {
            throw RangeError("Day of week not valid!");
        }

        while (true) {
            if (date.getDay() === dayOfWeek) {
                return date;
            }
            date.setDate(date.getDate() + 1)
        }
    }

    isPlayerInTheGame(player, currentDate) {
        return player[1].getTime() < currentDate.getTime() && player[2].getTime() > currentDate.getTime();
    }

    // Knappene
    changeDate(days) {
        const modNumber = days < 0 ? -1 : 1;
        const currentDate = new Date(this.state.todayDate);

        const playDate = this.getNextPlayday(currentDate);
        

        while(true) {
            currentDate.setDate(currentDate.getDate() + modNumber);
            if(this.getNextPlayday(currentDate).getDate() !== playDate.getDate()) {
                break;
            }
        }

        if(currentDate.getTime() > this.state.endDate.getTime() || currentDate.getTime() < this.props.startDate.getTime()) {
            const word = days < 0 ? "tilbake" : "fram";
            alert("Må du virkelig så langt "+word+" i snackkalenderen?")
            return;
        }
        this.setState({
            todayDate: currentDate,
        });
    }

    // Knappen
    resetDate() {
        this.setState({
            todayDate: new Date(),
        });
    }

    formatDate(det) {
        return det.getDate() + "." + (det.getMonth()+1) + "." + det.getFullYear();
    }

    numberToWeekDay(number) {
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

    // Vi kan ha et vilkårlig antall kolonner. Spilleren vi har kalkulert oss fram til får ansvar for kolonne 1. Neste får 2, etc. 
    generatePlayerIdsForColumnCount(columnCount, id, date) {
        if(id === null) {
            return [];
        }
        const currentMainBuyer = this.state.players[id];
        const currentPlayers = this.state.players.filter(player => this.isPlayerInTheGame(player, date));

        currentPlayers.forEach((p, i) => {
            if(p === currentMainBuyer) {
                id = i;
                return;
            }
        });
        const arr = [];
        for(let i=0;i<columnCount;i++) {
            if(id > currentPlayers.length -1) {
                id = 0;
            }
            arr.push(currentPlayers[id][0]);
            id++;
        }
        return arr;
    }

    render() {
        const mainPlayer = this.whoseTurn(this.state.todayDate);
        const poorUnfortunateSouls = this.generatePlayerIdsForColumnCount(this.state.columns.length, mainPlayer === null ? null : mainPlayer[1], this.state.todayDate);
        return (
            <div className="container">
                <h2>{this.props.title}</h2>
                <div>Tabell for {this.numberToWeekDay(this.getNextPlayday(this.state.todayDate).getDay())} {this.formatDate(this.getNextPlayday(this.state.todayDate))}</div>
                <div>
                    <button onClick={() => this.changeDate(-7)}>Forrige</button>
                    <button onClick={() => this.resetDate()}>Nærmeste</button>
                    <button onClick={() => this.changeDate(7)}>Neste</button>
                </div>
                <table id="snacktable" border="1">
                    <th>Navn</th>
                    {this.state.columns.map(col => {
                        return (<th>{col}</th>)
                    })}
                    {this.state.players.map(player => {
                        if(!this.isPlayerInTheGame(player, this.state.todayDate)) {
                            return null;
                        }
                        return (<tr>
                            <td>{player[0]}</td>
                            {this.state.columns.map((col, index) => {
                                const cross = poorUnfortunateSouls[index] === player[0] ? <img id="sodiepop" src={check} alt="the one who has to do it"/> : "";
                                return (<td>{cross}</td>)
                            })}
                        </tr>)
                    })}
                </table>
            </div>
        );
    }
}

export default Snacktime2;