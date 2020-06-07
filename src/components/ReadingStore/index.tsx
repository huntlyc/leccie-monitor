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
  clearData() {
    this.readings.clear();
  }
  seedData() {
    this.readings.add({
      date: new Date(Date.parse('2019/10/05 23:32')).toISOString(),
      reading: '50.00'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/12 08:22')).toISOString(),
      reading: '31.63'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/16 12:22')).toISOString(),
      reading: '23.20'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/18 19:01')).toISOString(),
      reading: '61.03'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/20 14:01')).toISOString(),
      reading: '44.44'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/21 14:01')).toISOString(),
      reading: '41.03'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/25 17:41')).toISOString(),
      reading: '37.28'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/26 10:41')).toISOString(),
      reading: '35.10'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/26 19:41')).toISOString(),
      reading: '34.19'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/27 10:21')).toISOString(),
      reading: '29.23'
    });
    this.readings.add({
      date: new Date(Date.parse('2019/10/27 11:20')).toISOString(),
      reading: '29.04'
    });
  }
}
