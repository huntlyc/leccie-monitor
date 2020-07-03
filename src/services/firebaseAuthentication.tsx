import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

import { createContext } from 'react';

export const FirebaseContext = createContext(null);


const envPersistenceStrategy = process.env.NODE_ENV === 'test' 
  ? firebase.auth.Auth.Persistence.NONE 
  : firebase.auth.Auth.Persistence.LOCAL;


class FirebaseAuthentication{
    constructor(){
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
    }


    onUserChange():Promise<string | null>{
        return new Promise((resolve, reject) => {
            firebase.auth().onIdTokenChanged((user) => {
                if(user){
                    resolve(user.uid);
                }else{
                    reject(null);
                }
            });
        });
    }


    register(username:string, password: string):Promise<string | null>{
        return new Promise((resolve, reject) => 
        {
            firebase.auth().setPersistence(envPersistenceStrategy).then(() => {
                firebase.auth().createUserWithEmailAndPassword(username, password).then((userCred) => {
                    if(userCred && userCred.user && userCred.user.uid){
                        resolve(userCred?.user?.uid);
                    }
                }).catch((err) => {
                    reject(err.message);
                });
            }).catch((err) => { // Persistence not supported on browser
                reject(err);
            });
        });
    }


    login(username:string, password: string):Promise<string | null>{
        return new Promise((resolve, reject) => {
            firebase.auth().setPersistence(envPersistenceStrategy).then(() => {

                firebase.auth().signInWithEmailAndPassword(username, password).then((userCred) => {
                    if(userCred && userCred.user && userCred.user.uid){
                        resolve(userCred?.user?.uid);
                    }
                }).catch((err) => {
                    console.log(err);
                    reject(err.message);
                });
                
            }).catch((err) => { // Persistence not supported on browser
                reject(err);
            });
        });
    }


    logout():Promise<void>{
        return new Promise((resolve) => {
            firebase.auth().signOut().then(() => {
                resolve();
            });
        })
    }
}


const firebaseAuthentication = new FirebaseAuthentication();


export {firebaseAuthentication as FirebaseAuthentication};