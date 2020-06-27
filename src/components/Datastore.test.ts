import Datastore from './Datastore';

// TODO: This fails with a firebase error, figure out why
test('it adds a document with the right collection structure', async() => {
    const store = new Datastore('bob');
    const reading = await store.addReading({
        reading: '22',
        date: 'now'
    });

    console.log(reading);
});
