import Utils from '../utils';

test('Utils serialise should serialise an object', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(Utils.serialise({
        x: 'y',
        y: 'z'
    })).toEqual('x=y&y=z');
    expect(Utils.serialise.calls.count()).toBe(1);
});

test('Utils serialise should serialise an object with a child array', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(Utils.serialise({
        x: 'y',
        y: 'z',
        z: ['a', 'b']
    })).toEqual('x=y&y=z&z[0]=a&z[1]=b');
    expect(Utils.serialise.calls.count()).toBe(2);
});

test('Utils serialise should serialise an object with a child object and call recursively', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(Utils.serialise({
        x: 'y',
        y: 'z',
        z: ['a', 'b'],
        a: {
            b: 'c',
            c: 'd'
        }
    })).toEqual('x=y&y=z&z[0]=a&z[1]=b&a[b]=c&a[c]=d');
    expect(Utils.serialise.calls.count()).toBe(3);
});

test('Utils serialise should serialise an object with a child array, url encoded', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(Utils.serialise(
        {
            x: 'y',
            y: 'z',
            z: ['a', 'b'],
            a: {
                b: 'c',
                c: 'd'
            }
        },
        null,
        true,
        false
    )).toEqual('x=y&y=z&z%5B0%5D=a&z%5B1%5D=b&a%5Bb%5D=c&a%5Bc%5D=d');
    expect(Utils.serialise.calls.count()).toBe(3);
});

test('Utils serialise should serialise an object with a child array, url encoded and skip prefixed index', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(Utils.serialise(
        {
            x: 'y',
            y: 'z',
            z: ['a', 'b'],
            a: {
                b: 'c',
                c: 'd'
            }
        },
        null,
        true,
        true
    )).toEqual('x=y&y=z&z%5B%5D=a&z%5B%5D=b&a%5B%5D=c&a%5B%5D=d');
    expect(Utils.serialise.calls.count()).toBe(3);
});

test('Utils serialise should serialise an object with a child array and skip prefix index', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(Utils.serialise(
        {
            x: 'y',
            y: 'z',
            z: ['a', 'b'],
            a: {
                b: 'c',
                c: 'd'
            }
        },
        null,
        false,
        true
    )).toEqual('x=y&y=z&z[]=a&z[]=b&a[]=c&a[]=d');
    expect(Utils.serialise.calls.count()).toBe(3);
});

test('Utils buildQueryString should call serialise with the given object to parse as url parameters', () => {

    // spy on method
    spyOn(Utils, 'serialise').and.callThrough();
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // expected result
    Utils.buildQueryString(
        'https://google.com',
        {
            x: 'y',
            y: 'z',
            z: ['a', 'b'],
            a: {
                b: 'c',
                c: 'd'
            }
        }
    );
    expect(Utils.serialise.calls.count()).toBe(3);
});

test('Utils buildQueryString should append ? on a url without existing url parameters', () => {

    // spy on method
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // expected result
    expect(Utils.buildQueryString(
        'https://google.com',
        {
            x: 'y',
            y: 'z',
            z: ['a', 'b'],
            a: {
                b: 'c',
                c: 'd'
            }
        }
    )).toEqual('https://google.com?x=y&y=z&z[0]=a&z[1]=b&a[b]=c&a[c]=d');
});

test('Utils buildQueryString should append & on a url with existing url parameters', () => {

    // spy on method
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // expected result
    expect(Utils.buildQueryString(
        'https://google.com?test=1',
        {
            x: 'y',
            y: 'z',
            z: ['a', 'b'],
            a: {
                b: 'c',
                c: 'd'
            }
        }
    )).toEqual('https://google.com?test=1&x=y&y=z&z[0]=a&z[1]=b&a[b]=c&a[c]=d');
});

test('Utils replaceString should replace a given set of values with new values', () => {

    // spy on method
    spyOn(Utils, 'replaceString').and.callThrough();

    // expected result
    expect(Utils.replaceString(
        'https://google.com/{orgId}/division/{divId}',
        [
            '{orgId}',
            '{divId}'
        ],
        [
            '123',
            '456'
        ]
    )).toEqual('https://google.com/123/division/456');
});

test('Utils camelCaseToSnakeCase should convert strings correctly', () => {
    expect(Utils.camelCaseToSnakeCase('aaaa')).toEqual('aaaa');
    expect(Utils.camelCaseToSnakeCase('Aaaa')).toEqual('aaaa');
    expect(Utils.camelCaseToSnakeCase('AAaa')).toEqual('a_aaa');
    expect(Utils.camelCaseToSnakeCase('aAaA')).toEqual('a_aa_a');
    expect(Utils.camelCaseToSnakeCase('toLocaleDateString')).toEqual('to_locale_date_string');
    expect(Utils.camelCaseToSnakeCase('ABCDE')).toEqual('a_b_c_d_e');
});

// todo: add unit test for method excludeProps
// todo: add unit test for method isArray
// todo: add unit test for method createRootElement
// todo: add unit test for getTodayDate
// todo: add unit test for formatDate
// todo: add unit test for repeatPad
// todo: add unit test for padLeft

test('Utils should parse a given score correctly', () => {

    // 0 score is unset, should return 0
    expect(Utils.parseScore(0, 1, 5, true)).toEqual(0);
    expect(Utils.parseScore(0, 1, 5, false)).toEqual(0);

    expect(Utils.parseScore(0.1, 1, 5, false)).toEqual(1);
    expect(Utils.parseScore(0.1, 1, 5, true)).toEqual(1);

    expect(Utils.parseScore(1.1, 1, 5, true)).toEqual(1);
    expect(Utils.parseScore(1.1, 1, 5, false)).toEqual(1.1);

    expect(Utils.parseScore(3.5, 1, 5, true)).toEqual(3);
    expect(Utils.parseScore(4.9, 1, 5, false)).toEqual(4.9);

    expect(Utils.parseScore(7.6, 1, 5, true)).toEqual(5);
    expect(Utils.parseScore(5, 1, 5, false)).toEqual(5);
    expect(Utils.parseScore(5.1, 1, 5, false)).toEqual(5);
});
