import { UserDatastore } from "./Datastore";
import IReading from "./IReading";

class TestDatastore implements UserDatastore{
    readings: IReading[]
    constructor(){
        this.readings = [];
    }

    addReading(reading: IReading){
        this.readings.push(reading);
    }

    clearAllReadings(): Promise<void>{
        return new Promise((resolve,reject) => {
            this.readings = [];
            resolve();
        });
    }

    getAllReadings(): Promise<IReading[]>{
        return new Promise((resolve, reject) => {
            resolve(this.readings.reverse());
        });
    }
}


export default TestDatastore;