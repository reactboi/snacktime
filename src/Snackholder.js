import React from 'react';

import Snacktime from './Snacktime';

import './Snacktime.css';
import { fetchAndSplit } from './Fetcher';

class Snackholder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackLists: []
        };
    }

    async componentDidMount() {
        const splitted = await fetchAndSplit("listIndex.txt", r => r.includes("|"));
        const indexList = splitted.map(row => {
            return {
                title: row[0],
                startDate: new Date(row[1]),
                dayOfWeek: parseInt(row[2]),
                folderPrefix: row[3]
            }
        });
        this.setState({ snackLists: indexList });
        
    }


    render() {
        return (<div>{
            this.state.snackLists.map((row) => {
                return (<Snacktime 
                    title={row['title']}
                    startDate={row['startDate']} 
                    columns={row['folderPrefix']+"/columns.txt"} 
                    players={row['folderPrefix']+"/players.txt"} 
                    mods={row['folderPrefix']+"/extras.txt"} 
                    dayOfWeek={row['dayOfWeek']} />)
            })
        }</div>);
    }
}

export default Snackholder;