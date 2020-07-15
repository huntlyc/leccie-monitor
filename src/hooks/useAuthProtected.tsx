import { useState, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import { navigate } from '@reach/router';


export default function useAuthProtected(){
    const [isAuthorized, setIsAuthorizedTo] = useState(false);
    const firebase = useFirebase();


    useEffect(() => {
        let isActive = true;

        if (firebase && firebase.user !== false) {

            if(firebase.user === null){
                navigate('/auth/login');
            }else if(isActive){
                setIsAuthorizedTo(true);
            }
        }

        return () => { isActive = false };
    }, [firebase]);


    return [isAuthorized]
}