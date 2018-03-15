import ExampleItem from '../ExampleItem';
import { shallow } from 'preact-render-spy';

// test examples: https://github.com/mzgoddard/preact-render-spy/blob/master/src/shared-render.test.js
// cheat sheet: https://devhints.io/jest

test('check if ExampleItem is rendering', () => {
    const context = shallow(<ExampleItem/>);

    expect(context.find('section')).toBeTruthy();
});

test('check if state is toggled when clicking filter toggle button', () => {
    const context = shallow(<ExampleItem/>);
    const child = (context.find('span').at(0));

    expect(context.find('section').contains('active')).toBeFalsy();
    child.simulate('click');
    expect(context.find('section').contains('active')).toBeTruthy();
});

test('check if the initial items are rendered to the DOM', () => {
    const context = shallow(<ExampleItem items={ [{id: 'item 1'}, {id: 'item 2'}] } />);
    const list = (context.find('#project-list'));

    expect(list.find('li').length).toBe(2);

});

// todo: move this test to the root component and use deep assertion on appended item

// test('check if a new item is appended when clicking the add button', () => {
//     const context = shallow(<ExampleItem
//         items={ [{id: 'initial item 1'}, {id: 'initial item 2'}] }
//         addRandomItem={}
//     />);
//     const list = (context.find('#project-list'));
//     const child = (context.find('button'));
//
// // you will probably need these:
// context.setState({
//     items: [
//         {id: 'item 1'},
//         {id: 'item 2'}
//     ]
// });
//
// expect(context.state()).toEqual({
//     items: [
//         {id: 'item 1'},
//         {id: 'item 2'}
//     ]
// });
//     child.simulate('click');
//     expect(list.find('li').length).toBe(3);
// });
