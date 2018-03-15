jest.mock('../../../../../utils/showCurrentTime.js', () => jest.fn().mockReturnValue('12:34'));

// test examples: https://github.com/mzgoddard/preact-render-spy/blob/master/src/shared-render.test.js
// cheat sheet: https://devhints.io/jest

import Example from './../Example';
import { shallow } from 'preact-render-spy';

test('check if Example is rendering', () => {
    const context = shallow(<Example/>);

    expect(context.find('span')).toBeTruthy();
});

test('check if Example is rendering a timestamp', () => {
    const context = shallow(<Example />);

    expect(context.find('span').at(0).text()).toBe('12:34');
});
