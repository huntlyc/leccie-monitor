import React, { FunctionComponent, useState } from 'react';
import { DBReading } from './ReadingStore';
import { formatRelativeToDate } from '../Utils';


type LastReadingProps = {
    reading: DBReading,
    isRunningLow: boolean
};


const LastReading: FunctionComponent<LastReadingProps> = ({reading, isRunningLow}) => {

    const readingDate = formatRelativeToDate(reading.date as string, new Date().toISOString());

    return (
        <p data-testid="last-reading">Last reading:&nbsp;
            <strong data-testid="last-reading-price"  className={isRunningLow ? 'danger' : ''}>&pound;{reading.reading}</strong> -&nbsp;
            <span data-testid="last-reading-date" className="date">{readingDate}</span>
        </p>
    );
};


export default LastReading;