import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import firebase, { User } from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';
import DataStore from "../components/Datastore";
import { UserDatastore } from "../components/FirebaseDatastore";

firebase.initializeApp(firebaseConfig);

// Don't do persistence when tests run, node env doesn't support indexdb
if(process.env.NODE_ENV !== 'test'){
    firebase.firestore().enablePersistence().catch((err) => console.log(err));
}


interface IProps {
    children: ReactNode;
}


type FirebaseProvider = {
    user: firebase.User | false | null;
    dataStore: UserDatastore | null;
    signin: (email: string, password: string) => Promise<firebase.User | null>;
    signup: (email: string, password: string) => Promise<firebase.User | null>;
    signout: () => Promise<void>
    reAuth: (email: string, password: string) => false | Promise<firebase.auth.UserCredential>
    deleteAccount: () => false | Promise<void>
    sendPasswordResetEmail: (email: string) => Promise<boolean>;
    confirmPasswordReset: (code: string, password: string) => Promise<boolean>;
};


const firebaseContext = createContext<FirebaseProvider | undefined>(undefined)


export function ProvideAuth({ children }: IProps) {
    const auth = useFirebaseProvider();
    return <firebaseContext.Provider value={auth}>{children}</firebaseContext.Provider>;
};


function useFirebaseProvider(): FirebaseProvider {
    const [user, setUser] = useState<User | null | false>(false);
    const [dataStore, setDataStore] = useState<UserDatastore | null>(null);


    const signin = (email: string, password: string) => {
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                if (response.user?.uid) {
                    setUser(response.user);
                    setDataStore(DataStore.get(response.user.uid));
                }
                return response.user;
            });
    };


    const signup = (email: string, password: string) => {
        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
                if (response.user?.uid) {
                    setUser(response.user);
                    setDataStore(DataStore.get(response.user.uid));
                }
                return response.user;
            });
    };

    const reAuth = (email: string, password: string) => {

        if(user){
            const credential = firebase.auth.EmailAuthProvider.credential( email, password);
            // Now you can use that to reauthenticate
            return user.reauthenticateWithCredential(credential);
        }

        return false;
    };

    const deleteAccount = () => {
        if(user){
            return user.delete().then(() => {
                setUser(null);
                setDataStore(null);
            });
        }
        return false;
    }


    const signout = () => {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(null);
                setDataStore(null);
            });
    };


    const sendPasswordResetEmail = (email: string) => {
        return firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                return true;
            });
    };

    const confirmPasswordReset = (code: string, password: string) => {
        return firebase
            .auth()
            .confirmPasswordReset(code, password)
            .then(() => {
                return true;
            });
    };


    // put a watch on for a user state change (previously logged in)
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                if (user?.uid) {
                    setDataStore(DataStore.get(user.uid));
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);


    return {
        user,
        dataStore,
        signin,
        signup,
        signout,
        reAuth,
        deleteAccount,
        sendPasswordResetEmail,
        confirmPasswordReset
    };
}



export const useFirebase = () => {
    return useContext(firebaseContext);
};