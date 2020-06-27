import IReading from "./IReading";
import firebase from "firebase/app";
import 'firebase/firestore';
import firebaseConfig from "../firebaseConfig";

export interface UserDatastore{
    addReading: (reading: IReading) => void,
    getAllReadings: () => Promise<Array<IReading>>,
    clearAllReadings: () => Promise<void> | false
};


class FirebaseDataStore implements UserDatastore{
    uid: string;
    readings?: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;


    constructor(uid: string = ''){

        this.uid = uid;

        if(uid !== ''){
            this.initFirebase(uid);
        }
    }


    private initFirebase(uid: string) {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        this.readings = firebase.firestore().collection('readingLists').doc(uid).collection('readings');
    }

    async getAllReadings(){
        let fbReadings = await this.readings?.get();
        const readings: Array<IReading> = [];

        if(fbReadings){
            fbReadings.forEach((snapshot) => {
                readings.push(snapshot.data() as IReading);
            });
        }

        return readings;
    }


    async addReading(reading: IReading){
        let doc = await this.readings?.add({
            uid: this.uid,
            reading: reading.reading,
            date: reading.date
        });

        return doc;
    }


    clearAllReadings(){
        if(this.readings?.parent){
            return this.readings.parent?.delete();
        }

        return false;
    }
}


export default FirebaseDataStore;