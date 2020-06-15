import Dexie from 'dexie';

export interface  DBReading{
    id?: number,
    date: String;
    reading: String;
}

export class ReadingStorage extends Dexie {
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
}
