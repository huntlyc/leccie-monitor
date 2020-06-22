import Dexie, { PromiseExtended } from 'dexie';
import IReading from './IReading';

export interface  DBReading{
    id?: number,
    date: string;
    reading: string;
}

export interface IReadingStore {
  getAllReadings(): PromiseExtended<DBReading[]>,
  addReading(reading: IReading): PromiseExtended<number>,
  clearAllReadings(): PromiseExtended<void>,
};

export class LocalStorageReadingStore extends Dexie implements IReadingStore {
  //Define our collection asserting (!:) that its never undefined
  readings!: Dexie.Table<DBReading, number>;
  constructor() {
    super('ReadingsDB');
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

  getAllReadings(){
    return this.readings.toArray();
  }

  addReading(reading: IReading){
    return this.readings.add(reading);
  }

  clearAllReadings(){
    return this.readings.clear();
  }
}
