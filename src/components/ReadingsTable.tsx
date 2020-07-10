import React from 'react';
import IReading from './IReading';
import {formatRelativeToDate} from '../Utils';


type ReadingTableProps = {
    previousReadings: IReading[]
}
const ReadingTable:React.FC<ReadingTableProps> = ({previousReadings}) => {

    if (!previousReadings || previousReadings.length === 0) return <p data-testid="no-reading-message">Enter your first reading to get started!</p>;

    const renderPreviousReadingTableRow = (reading: IReading, currentIndex: number): JSX.Element => {

        let clsName = '';
        let txtDiff = ' \u2014 ';
        let curReading = parseFloat(reading.reading);

        // Run diff on every element except the last (which is the first user input value)
        // Readings is a FILO stack
        if (currentIndex < previousReadings.length - 1) {

            let diff = 0;
            let prevReading = parseFloat(previousReadings[++currentIndex].reading);

            diff = curReading - prevReading;

            if (diff === 0) {
                txtDiff = '';
            }
            else if (diff > 0) {
                txtDiff = `+${diff.toFixed(2)}`;
                clsName = 'positive';
            }
            else {
                txtDiff = `${diff.toFixed(2)}`;
                clsName = 'minus';
            }
        }

        return (
            <tr className={currentIndex === 1 && curReading < 10 ? 'danger-row' : ''} key={reading.date}>
                <td>&pound;{reading.reading}</td>
                <td className={clsName}>{txtDiff}</td>
                <td className="date">{formatRelativeToDate(reading.date, new Date().toISOString())}</td>
            </tr>
        );
    };


    return (
        <div id="last-readings">
            <table>
                <thead>
                    <tr>
                        <th>Reading</th>
                        <th>+/- Diff</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {previousReadings.map(renderPreviousReadingTableRow)}
                </tbody>
            </table>
        </div>
    );
};


export default ReadingTable;