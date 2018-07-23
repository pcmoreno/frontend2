import { shallow } from 'preact-render-spy';
import RedirectHelper from '../../redirectHelper';
import Redirect from "../Redirect";
import { route } from 'preact-router';

// Mock the redirectHelper
jest.mock('../../redirectHelper', () => {
    return {
        instance: {
            setRedirectPath: (path) => {
                return null;
            }
        }
    };
});

// Mock the router
jest.mock('preact-router', () => {
    return {
        route: () => {
            return null;
        }
    };
});

// todo: tests below should be finished later, when knowing how to spy on global (window.location) and on a method route) directly.

test('Should not redirect if no path was given', () => {

    spyOn(RedirectHelper.instance, 'setRedirectPath');
    // spyOn(route);

    const context = shallow(<Redirect/>);

    expect(RedirectHelper.instance.setRedirectPath.calls.count()).toBe(0);
});

test('Should redirect to given path without refreshing the application', () => {

    spyOn(RedirectHelper.instance, 'setRedirectPath');

    const context = shallow(<Redirect to='/path' />);

    expect(RedirectHelper.instance.setRedirectPath.calls.count()).toBe(1);
});

test('Should redirect to the given path with refreshing the page', () => {

    spyOn(RedirectHelper.instance, 'setRedirectPath');

    const context = shallow(<Redirect to='/path' refresh={ true }/>);

    expect(RedirectHelper.instance.setRedirectPath.calls.count()).toBe(0);
});
