import Dexie from 'dexie';
Dexie.dependencies.indexedDB = require('fake-indexeddb')
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
import { DBReading } from './ReadingStore';

export class ReadingStorage extends Dexie {
    //Define our collection asserting (!:) that its never undefined
    readings!: Dexie.Table<DBReading, number>;
    constructor() {
        super('TestReadingsDB');
        //Our table(s) schema
        this.version(1).stores({
            readings: '++id, date, reading'
        });
        /**
         * The following line is needed if your typescript is compiled using
         * babel instead of tsc e.g. using 'react-create-app'
         **/
        this.readings = this.table("readings");
    }
}