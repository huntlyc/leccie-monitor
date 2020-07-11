
import React, { useState, FunctionComponent, useEffect } from 'react';
import AlertBanner from './components/AlertBanner';
import ReadingForm from './components/InputForm';
import ReadingTable from './components/ReadingsTable';
import IReading from './components/IReading';
import { useFirebase } from './hooks/useFirebase';
import { RouteComponentProps } from '@reach/router';
import { useNavigate } from "@reach/router"

interface HomeProps extends RouteComponentProps{
    // Nothing extra to add...
}

const Home: FunctionComponent<HomeProps> = (props:HomeProps) => {

    const navigate = useNavigate();
    const [isLoading, setIsLoadingTo] = useState(true);
    const firebase = useFirebase();
    const [showMenu, shouldShowMenu] = useState(false);
    const [previousReadings, updatePreviousReadings] = useState<IReading[]>([]);


    const toggleMenu = () => {
        shouldShowMenu(!showMenu);
    };


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


    const userLoggedOut = () => {
        updatePreviousReadings([]);
        shouldShowMenu(false);

        if (firebase) {
            firebase.signout();
        }
    };

    useEffect(() => {
        let isActive = true;

        if (firebase && firebase.user !== false) {
            if (isActive) {
                setIsLoadingTo(false);
            }
            if (firebase.dataStore) {
                firebase.dataStore.getAllReadings().then((res) => {
                    if (isActive) {
                        if (res.length > 0) {
                            updatePreviousReadings(res);
                        }
                    }
                });
            }
        }


        return () => { isActive = false };
    }, [firebase]);


    const getMainContentArea = () => {
        if (isLoading) return <p>Loading...</p>;

        if (!firebase) return null;

        if (firebase.user) {
            return <ReadingTable previousReadings={previousReadings} />;
        } else{
            navigate('/user/login')
        }
    };


    const lastReadingValue = readings.getMostRecent();
    const isRunningLow = lastReadingValue && parseFloat(lastReadingValue.reading) < 10;
    let alertMessage = 'Running low, go top up!!!';
    if(lastReadingValue && parseFloat(lastReadingValue.reading) < 0){
        alertMessage = '!! ON EMERGENCY CREDIT !!';

    }


    const clearReadings = function (e: React.FormEvent) {
        e.preventDefault();
        readings.clearAll();
    };

    return (
        <>
            {firebase && firebase.user &&
                <ReadingForm onSuccess={readings.add} onClear={readings.clearAll} />
            }
            {firebase && firebase.user &&
                <>
                    <button name="menu" onClick={toggleMenu}><img alt="Menu Icon - click to toggle menu" src={process.env.PUBLIC_URL + "/gear.svg"} /><span className="sr-only">{showMenu ? 'Close' : 'Menu'}</span></button>
                    {showMenu && <div onClick={toggleMenu} className="overlay"></div>}
                    <div data-testid="menu" className={showMenu ? 'popup active' : 'popup'}>
                        <div>
                            <button className="close" onClick={toggleMenu}><span className="sr-only">Close </span>&times;</button>
                            <ul>
                                <li><button onClick={clearReadings}>Clear Readings</button></li>
                            </ul>
                        </div>
                        <button onClick={userLoggedOut}>Logout</button>

                    </div>
                </>
            }
            {getMainContentArea()}
            {isRunningLow && <AlertBanner message={alertMessage} />}
        </>
    );
}


export default Home;