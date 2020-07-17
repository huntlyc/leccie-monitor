import IReading from "./IReading";
import firebase from "firebase/app";
import 'firebase/firestore';

export interface UserDatastore{
    addReading: (reading: IReading) => void,
    changeUser: (newUid: string) => void,
    getAllReadings: () => Promise<Array<IReading>>,
    clearAllReadings: () => Promise<void> | undefined
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
        let fbReadings = await this.readingRef?.orderBy('date', 'desc').get();

        if(fbReadings){
            fbReadings.forEach((snapshot) => {
                readings.push(snapshot.data() as IReading);
            });
        }

        return readings;
    }



    async addReading(reading: IReading){

        if(this.readingRef){
            return this.readingRef.add({
                uid: this.uid,
                reading: reading.reading,
                date: reading.date
            });
        }

        return false;
    }


    clearAllReadings(){
        return this.readingRef?.get().then((res) => {
            res.forEach((doc) => {
                doc.ref.delete();
            });
        });
    }


    private configureFirebase(){
        this.readingRef = firebase.firestore().collection('readingLists').doc(this.uid).collection('readings');
    }
}


export default FirebaseDataStore;