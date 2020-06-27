import IReading from "./IReading";
import firebase from "firebase/app";
import 'firebase/firestore';
import firebaseConfig from "../firebaseConfig";

export interface UserDatastore{
    addReading: (reading: IReading) => void,
    changeUser: (newUid: string) => void,
    getAllReadings: () => Promise<Array<IReading>>,
    clearAllReadings: () => Promise<void> | false
};


class FirebaseDataStore implements UserDatastore{
    uid: string;
    readingRef?: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;


    constructor(uid: string = ''){
        this.uid = uid;

        if(uid !== ''){
            this.configureFirebase();
        }
    }


    changeUser(uid: string) {
        this.uid = uid;
        this.configureFirebase();
    }


    async getAllReadings(){
        const readings: Array<IReading> = [];
        let fbReadings = await this.readingRef?.get();

        if(fbReadings){
            fbReadings.forEach((snapshot) => {
                readings.push(snapshot.data() as IReading);
            });
        }

        return readings;
    }



    async addReading(reading: IReading){
        let readingRef = firebase.firestore().collection('readingLists').doc(this.uid).collection('readings');

        if(readingRef){
            return readingRef.add({
                uid: this.uid,
                reading: reading.reading,
                date: reading.date
            });
        }


        return false;
    }


    clearAllReadings(){
        if(this.readingRef?.parent){
            return this.readingRef.parent?.delete();
        }

        return false;
    }


    private configureFirebase(){
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        this.readingRef = firebase.firestore().collection('readingLists').doc(this.uid).collection('readings');
    }
}


export default FirebaseDataStore;