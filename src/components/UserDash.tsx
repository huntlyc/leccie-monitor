import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
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
    const [password, setPasswordTo] = useState('');
    const [isAuthorized] = useAuthProtected();
    const firebase = useFirebase();
    const passwordRef = useRef<HTMLInputElement>(null);

    const clearReadings = () => {
        if(window.confirm('Are you sure?! No take-backs!')){
            props.clearReadings();
            setActionMsg('Cleared!');
        }
    };

    
    const initAccountDelete = () => {
        setNeedsReAuth(true);
    };


    useEffect(() => {
        if(needsReAuth && passwordRef && passwordRef.current){
            passwordRef.current.focus()
        }
    }, [needsReAuth])

    const confirmDelete = (e: React.FormEvent) => {
        e.preventDefault();

        if(firebase && firebase.user && firebase.user.email !== null){

            const credential = firebase.reAuth(
                firebase.user.email, 
                password
            );

            if(credential !== false){
                credential.then((credentail) => {   
                    firebase.dataStore?.clearAllReadings();
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
    

    const passwordChangeHandler = (e: React.FormEvent) => {
        setPasswordTo((e.target as HTMLInputElement).value);
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
                        <input ref={passwordRef} onChange={passwordChangeHandler} type="password" name="password"/><br/><br/>
                        <button>Delete Me!</button>
                    </form>
                }
            </>
        )
    }

    return displayContent();
};


export default UserDash;