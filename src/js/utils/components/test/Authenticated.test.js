import { shallow } from 'preact-render-spy';
import Authenticated from '../Authenticated';
import utils from '../../utils';

// Mock the utils
jest.mock('../../utils', () => {
    return {
        createRootElement: (children, props) => {
            return null;
        },
        excludeProps: (exclude, props) => {
            return null;
        }
    }
});

test('Should throw an error if api is undefined', () => {
   try {
       const context = <Authenticated>
           <div/>
       </Authenticated>;
   } catch (e) {
       expect(e.message).toBe('<Authenticated> api property must be defined');
   }
});

test('Should render a div when is authenticated', () => {
    const authenticator = {
        isAuthenticated: () => {
            return true;
        }
    };
    const api = {
        getAuthenticator: () => {
            return authenticator;
        }
    };

    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'isAuthenticated').and.callThrough();
    spyOn(utils, 'createRootElement');
    spyOn(utils, 'excludeProps');

    const context = shallow(<Authenticated api={api}>
        <div>Some authenticated component</div>
    </Authenticated>);

    expect(api.getAuthenticator.calls.count()).toBe(1);
    expect(authenticator.isAuthenticated.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.createRootElement.calls.count()).toBe(1);

    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            ["api"],
            {
                "api": api,
                "children": [
                    {
                        "attributes": undefined,
                        "children": [
                            "Some authenticated component"
                        ],
                        "key": undefined,
                        "nodeName": "div"
                    }
                ]
            }
        ]
    ]);
    expect(utils.createRootElement.calls.allArgs()).toEqual([
        [
            [
                {
                    "attributes": undefined,
                    "children": [
                        "Some authenticated component"
                    ],
                    "key": undefined,
                    "nodeName": "div"
                }
            ],
            undefined // props are nothing as api is excluded
        ]
    ]);
});

test('Should not render a div when is not authenticated', () => {
    const authenticator = {
        isAuthenticated: () => {
            return false;
        }
    };
    const api = {
        getAuthenticator: () => {
            return authenticator;
        }
    };

    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'isAuthenticated').and.callThrough();
    spyOn(utils, 'createRootElement');
    spyOn(utils, 'excludeProps');

    const context = shallow(<Authenticated api={api}>
        <div>Some authenticated component</div>
    </Authenticated>);

    expect(api.getAuthenticator.calls.count()).toBe(1);
    expect(authenticator.isAuthenticated.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.createRootElement.calls.count()).toBe(0);

    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            ["api"],
            {
                "api": api,
                "children": [
                    {
                        "attributes": undefined,
                        "children": [
                            "Some authenticated component"
                        ],
                        "key": undefined,
                        "nodeName": "div"
                    }
                ]
            }
        ]
    ]);
    expect(utils.createRootElement.calls.allArgs()).toEqual([]);
});
