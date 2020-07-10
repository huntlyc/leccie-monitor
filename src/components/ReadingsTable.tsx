import React from 'react';
import IReading from './IReading';
import {formatRelativeToDate} from '../Utils';

const ReadingTable = function(props: any){

    if (!props.previousReadings || props.previousReadings.length === 0) return <p data-testid="no-reading-message">Enter your first reading to get started!</p>;

    const renderPreviousReadingTableRow = (reading: IReading, currentIndex: number): JSX.Element => {

        let clsName: string = '';
        let txtDiff: string = ' \u2014 ';

        //don't run on the first result as there's no difference!!
        if (currentIndex < props.previousReadings.length - 1) {

            let diff: number = 0;
            let curReading: number = parseFloat(reading.reading);
            let prevReading: number = parseFloat(props.previousReadings[++currentIndex].reading);

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
            <tr className={currentIndex === 1 && props.lastReading && parseFloat(props.lastReading.reading) < 10 ? 'danger-row' : ''} key={reading.date}>
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
                    {props.previousReadings.map(renderPreviousReadingTableRow)}
                </tbody>
            </table>
        </div>
    );

};

export default ReadingTable;