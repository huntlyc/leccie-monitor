import React, { FunctionComponent } from 'react';
import { formatRelativeToDate } from '../Utils';
import IReading from './IReading';


type LastReadingProps = {
    reading: IReading,
    isRunningLow: boolean
};


const LastReading: FunctionComponent<LastReadingProps> = ({reading, isRunningLow}) => {

    const readingDate = formatRelativeToDate(reading.date, new Date().toISOString());

    return (
        <p data-testid="last-reading">Last reading:&nbsp;
            <strong data-testid="last-reading-price"  className={isRunningLow ? 'danger' : ''}>&pound;{reading.reading}</strong> -&nbsp;
            <span data-testid="last-reading-date" className="date">{readingDate}</span>
        </p>
    );
};


export default LastReading;