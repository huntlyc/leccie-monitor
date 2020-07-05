import TestDatastore from "./TestDataStore";
import FirebaseDataStore from "./FirebaseDatastore";

class DataStore{
    get(uid:string){
        let dataStore;
        if(process.env.NODE_ENV === 'test'){
            dataStore = new TestDatastore();
        }else{
            dataStore = new FirebaseDataStore(uid);
        }
        return dataStore;
    }
}

export default DataStore;