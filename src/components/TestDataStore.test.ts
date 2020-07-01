import TestDatastore from "./TestDataStore";
import IReading from "./IReading";


test('it adds readings correctly', async() => {
    const ds = new TestDatastore();
    const reading:IReading = {
        reading: '22',
        date: 'now'
    };

    ds.addReading(reading);

    const readings = await ds.getAllReadings();
    expect(readings.pop()).toEqual(reading);
});


test('it adds multiple readings correctly', async() => {
    const ds = new TestDatastore();
    const reading:IReading = {
        reading: '22',
        date: 'now'
    };
    const secondReading:IReading = {
        reading: '22',
        date: 'now'
    }

    ds.addReading(reading);
    ds.addReading(secondReading);

    const readings = await ds.getAllReadings();

    expect(readings.length).toBe(2);
    expect(readings.pop()).toEqual(reading);
    expect(readings.pop()).toEqual(secondReading);
});


test('it clears', async () => {
    const ds = new TestDatastore();
    const reading:IReading = {
        reading: '22',
        date: 'now'
    };
    const secondReading:IReading = {
        reading: '22',
        date: 'now'
    };

    ds.addReading(reading);
    ds.addReading(secondReading);
    ds.clearAllReadings();
    
    const readings = await ds.getAllReadings();

    expect(readings.length).toBe(0);
});