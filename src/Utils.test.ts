import {getDatePieces, formatRelativeToDate, isValidEmail} from './Utils';

test('it splits a date into the right pieces', () => {
    expect(getDatePieces('2020/02/01 09:08:00')).toEqual({"y": "2020", "m": "02", "d": "01", "h": "09", "i": "08"});
    expect(getDatePieces('2020/02/28 09:08:00')).toEqual({"y": "2020", "m": "02", "d": "28", "h": "09", "i": "08"});
});

test('formats relative dates', () => {

    //Ensure exception on time travel entries
    function testFutureDate(){
        formatRelativeToDate('2020/02/01 09:07:01','2020/02/01 09:07:00');
    }
    expect(testFutureDate).toThrow(Error);

    //Today tests
    expect(formatRelativeToDate('2020/02/01 09:07:00','2020/02/01 09:07:00')).toBe('just now');
    expect(formatRelativeToDate('2020/02/01 09:07:00','2020/02/01 09:08:00')).toBe('a minute ago');
    expect(formatRelativeToDate('2020/02/01 09:06:00','2020/02/01 09:08:00')).toBe('2 minutes ago');
    expect(formatRelativeToDate('2020/02/01 09:00:00','2020/02/01 09:59:00')).toBe('59 minutes ago');
    expect(formatRelativeToDate('2020/02/01 07:00:00','2020/02/01 09:00:00')).toBe('today at 07:00');

    //Yesterday Test
    expect(formatRelativeToDate('2020/01/31 07:00:00','2020/02/01 09:00:00')).toBe('yesterday at 07:00');

    /**
     * Past week test
     * 2020/05/31 - sunday
     * 2020/05/25 - monday before
     */
    expect(formatRelativeToDate('2020/05/25 00:00:00','2020/05/31 00:00:00')).toBe('monday at 00:00');

    // Couple of months back
    expect(formatRelativeToDate('2020/02/01 00:00:00','2020/05/31 00:00:00')).toBe('01/02/2020 at 00:00');
});

describe('email validation', () => {
    test('it validates bob@bob.com but not bob[at]bob[dot]com', () => {
        expect(isValidEmail('bob@bob.com')).toBeTruthy();
        expect(isValidEmail('bob[at]bob[dot]com')).toBeFalsy();
    });
})