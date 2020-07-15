import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useFirebase } from '../hooks/useFirebase';
import { humanReadableFirebaseError } from '../Utils';
import useAuthProtected from '../hooks/useAuthProtected';


interface UserDashProps extends RouteComponentProps{
    clearReadings: () => void;
}


const UserDash:FunctionComponent<UserDashProps> = (props: UserDashProps) => {
    
    const [needsReAuth, setNeedsReAuth] = useState(false);
    const [actionMsg, setActionMsg] = useState('');
    const [isAuthorized] = useAuthProtected();
    const firebase = useFirebase();


    const clearReadings = () => {
        if(window.confirm('Are you sure?! No take-backs!')){
            props.clearReadings();
            setActionMsg('Cleared!');
        }
    };

    
    const initAccountDelete = () => {
        setNeedsReAuth(true);
    };


    const confirmDelete = (e: React.FormEvent) => {
        e.preventDefault();

        if(firebase && firebase.user && firebase.user.email !== null){

            const credential = firebase.reAuth(
                firebase.user.email, 
                (document.getElementsByName('password')[0] as HTMLInputElement).value
            );

            if(credential !== false){
                credential.then((credentail) => {   
                    firebase.deleteAccount();
                }).catch((err) => {
                    let errorMsg = '';

                    if(typeof err == 'string'){
                        errorMsg = err;
                    }else if(err.code){
                        errorMsg = err.code;
                    }

                    errorMsg = humanReadableFirebaseError(errorMsg)

                    setActionMsg(errorMsg);
                });
            }
        } 
    };
    

    const displayContent = () => {

        if(!isAuthorized) return <p>Please wait...</p>;

        return (
            <>
                <h1>Account Settings</h1>
                {actionMsg !== '' && <p>{actionMsg}</p>}
                <ul className="button-group">
                    <li><button onClick={clearReadings}>Clear Readings</button></li>
                    <li><button onClick={initAccountDelete}>Delete Account</button></li>
                </ul>
                {needsReAuth && 
                    <form onSubmit={confirmDelete}>
                        <label htmlFor="password">Password</label><br/>
                        <input type="password" name="password"/><br/><br/>
                        <button>Delete Me!</button>
                    </form>
                }
            </>
        )
    }

    return displayContent();
};


export default UserDash;