import React from 'react';


import './Snacktime.css';
import { fetchAndSplit } from './helpers/fetch-and-split';
import { Snacktime } from './Snacktime';

class Snackholder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackLists: []
        };
    }

    async componentDidMount() {
        const splitted = await fetchAndSplit("listIndex.txt");
        const indexList = splitted.map(row => {
            return {
                title: row[0],
                startDate: row[1],
                dayOfWeek: parseInt(row[2]),
                folderPrefix: row[3]
            }
        });
        this.setState({ snackLists: indexList });
        
    }
    
    render() {
        return (<div>
            <div className='snackTime3'>{
                this.state.snackLists.map((row) => {
                return (<Snacktime 
                        folderPrefix={row.folderPrefix}
                        title={row.title}
                        startDate={row.startDate} 
                        dayOfWeek={row.dayOfWeek} />)
                })}</div>
        </div>);
    }
}

export default Snackholder;