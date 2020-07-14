import React, { useState, FunctionComponent, useEffect } from 'react';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/ReadingForm';
import ReadingTable from './components/ReadingsTable';
import IReading from './components/IReading';
import { useFirebase } from './hooks/useFirebase';
import { RouteComponentProps } from '@reach/router';
import { useNavigate } from "@reach/router"

interface HomeProps extends RouteComponentProps {
    // Nothing extra to add...
}

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {

    const navigate = useNavigate();
    const [isLoading, setIsLoadingTo] = useState(true);
    const firebase = useFirebase();
    const [previousReadings, updatePreviousReadings] = useState<IReading[]>([]);

    // Small collection of utility functions related to readings
    const readings = {
        add: function (reading: string) {

            const readingObj: IReading = {
                date: new Date().toISOString(),
                reading: reading
            }

            if (firebase && firebase?.user && firebase?.dataStore) {

                firebase.dataStore.addReading(readingObj);

                let readings = previousReadings.slice(0);
                readings.unshift(readingObj);
                updatePreviousReadings(readings);
            }
        },
        clearAll: function () {
            if (firebase && firebase?.user && firebase?.dataStore) {
                updatePreviousReadings([]);
                firebase.dataStore.clearAllReadings();
            }
        },
        getMostRecent: function () {
            if (previousReadings && previousReadings[0]) {
                return previousReadings[0];
            }

            return false;
        }
    };



    useEffect(() => {
        let isActive = true;

        if (firebase && firebase.user !== false) {
            if (isActive) {
                setIsLoadingTo(false);
            }
            if (firebase.dataStore) {
                setIsLoadingTo(true);
                firebase.dataStore.getAllReadings().then((res) => {
                    if (isActive) {
                        if (res.length > 0) {
                            updatePreviousReadings(res);
                        }
                    }
                    setIsLoadingTo(false);
                });
            }
        }


        return () => { isActive = false };
    }, [firebase]);


    const getMainContentArea = () => {
        if (isLoading) return <p>Loading...</p>;

        if (!firebase) return null;

        if (firebase.user) {
            return <ReadingTable previousReadings={previousReadings} isLoading={isLoading} />;
        } else {
            navigate('/auth/login')
        }
    };


    const lastReadingValue = readings.getMostRecent();
    const isRunningLow = lastReadingValue && parseFloat(lastReadingValue.reading) < 10;
    let alertMessage = 'Running low, go top up!!!';
    if (lastReadingValue && parseFloat(lastReadingValue.reading) < 0) {
        alertMessage = '!! ON EMERGENCY CREDIT !!';

    }



    return (
        <>
            {firebase && firebase.user &&
                <ReadingForm onSuccess={readings.add} />
            }
            {getMainContentArea()}
            {isRunningLow && <AlertBanner message={alertMessage} />}
        </>
    );
}


export default Home;