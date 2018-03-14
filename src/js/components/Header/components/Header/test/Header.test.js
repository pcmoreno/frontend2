import Header from './../Header';
import { shallow, deep } from 'preact-render-spy';

// to prevent the 'Cannot read property split of undefined' error, mock away the font-awesome import
jest.mock('@fortawesome/react-fontawesome', () => jest.fn().mockReturnValue('true'));

// test examples: https://github.com/mzgoddard/preact-render-spy/blob/master/src/shared-render.test.js
// cheat sheet: https://devhints.io/jest

test('check if Header is rendering empty figure with class \'logo\'', () => {
    const context = shallow(<Header/>);
    context.setState({ items: {label: 'inbox', link: '/'}});

    expect(context.find('figure').text()).toBe('');
    // expect(context.find('figure').attr('className')).toBe('logo'); // do not use 'class' here
});

test('check if Navigation items are populated', () => {
    const context = shallow(<Header/>);

    expect(context.find('Navigation').attr('items')).toEqual([
        {
            "label": "Inbox",
            "link": "/inbox"
        },
        {
            "label": "Organisations",
            "link": "/organisations"
        },
        {
            "label": "Tasks",
            "link": "/tasks"
        },
        {
            "label": "Users",
            "link": "/users"
        },
        {
            "label": "Participants",
            "link": "/participants"
        }
    ]);
});

test('use "deep" instead of "shallow" to test something in a child component', () => {
    const context = deep(<Header/>);

    expect(context.find('a').length).toBe(9);
    // expect(context.find('li').contains(<a href="/inbox">Inbox</a>)).toBeTruthy();
});

test('check for link validity', () => {
    const context = deep(<Header/>);
    const child = (context.find('a').at(0));

    expect(child.attr('href')).toBe('/inbox');
    child.simulate('click'); // dont test if link is being followed. instead test state or className change
});
