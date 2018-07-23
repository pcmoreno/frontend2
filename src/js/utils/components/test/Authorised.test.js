import { shallow } from 'preact-render-spy';
import Authorised from '../Authorised';
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
        const context = <Authorised component={{}} action={{}}>
            <div/>
        </Authorised>;
    } catch (e) {
        expect(e.message).toBe('<Authorised> api, component and action properties must be defined.');
    }
});

test('Should throw an error if component is undefined', () => {
    try {
        const context = <Authorised api={{}} action={{}}>
            <div/>
        </Authorised>;
    } catch (e) {
        expect(e.message).toBe('<Authorised> api, component and action properties must be defined.');
    }
});

test('Should throw an error if action is undefined', () => {
    try {
        const context = <Authorised api={{}} component={{}}>
            <div/>
        </Authorised>;
    } catch (e) {
        expect(e.message).toBe('<Authorised> api, component and action properties must be defined.');
    }
});

test('Should render a div when is authorised', () => {
    const authenticator = {
        isAuthenticated: () => {
            return true;
        },
        getUser: () => {
            return {

            };
        }
    };
    const authoriser = {
        authorise: (user, component, action) => {
            return true;
        }
    };
    const api = {
        getAuthenticator: () => {
            return authenticator;
        },
        getAuthoriser: () => {
            return authoriser;
        }
    };

    // authorise flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'getUser').and.callThrough();
    spyOn(authoriser, 'authorise').and.callThrough();

    // render flow
    spyOn(utils, 'excludeProps');
    spyOn(utils, 'createRootElement');

    const context = shallow(<Authorised api={api} component='report' action='writeAction'>
        <div>Some widget(s) to write reports</div>
    </Authorised>);

    // authorise flow
    expect(api.getAuthoriser.calls.count()).toBe(1);
    expect(api.getAuthenticator.calls.count()).toBe(1);
    expect(authenticator.getUser.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.allArgs()).toEqual([
        [
            authenticator.getUser(),
            "report",
            "writeAction"
        ]
    ]);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            ["api"],
            {
                "action": "writeAction",
                "api": api,
                "children": [
                    {
                        "attributes": undefined,
                        "children": [
                            "Some widget(s) to write reports"
                        ],
                        "key": undefined,
                        "nodeName": "div"
                    }
                ],
                "component": "report"
            }
        ]
    ]);

    expect(utils.createRootElement.calls.count()).toBe(1);
    expect(utils.createRootElement.calls.allArgs()).toEqual([
        [
            [
                {
                    "attributes": undefined,
                    "children": [
                        "Some widget(s) to write reports"
                    ],
                    "key": undefined,
                    "nodeName": "div"
                }
            ],
            undefined // props are nothing as api is excluded
        ]
    ]);
});

test('Should not render a div when is not Authorised', () => {
    const authenticator = {
        isAuthenticated: () => {
            return true;
        },
        getUser: () => {
            return {

            };
        }
    };
    const authoriser = {
        authorise: (user, component, action) => {
            return false;
        }
    };
    const api = {
        getAuthenticator: () => {
            return authenticator;
        },
        getAuthoriser: () => {
            return authoriser;
        }
    };

    // authorise flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'getUser').and.callThrough();
    spyOn(authoriser, 'authorise').and.callThrough();

    // render flow
    spyOn(utils, 'excludeProps');
    spyOn(utils, 'createRootElement');

    const context = shallow(<Authorised api={api} component='report' action='writeAction'>
        <div>Some widget(s) to write reports</div>
    </Authorised>);

    // authorise flow
    expect(api.getAuthoriser.calls.count()).toBe(1);
    expect(api.getAuthenticator.calls.count()).toBe(1);
    expect(authenticator.getUser.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.allArgs()).toEqual([
        [
            authenticator.getUser(),
            "report",
            "writeAction"
        ]
    ]);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            ["api"],
            {
                "action": "writeAction",
                "api": api,
                "children": [
                    {
                        "attributes": undefined,
                        "children": [
                            "Some widget(s) to write reports"
                        ],
                        "key": undefined,
                        "nodeName": "div"
                    }
                ],
                "component": "report"
            }
        ]
    ]);

    expect(utils.createRootElement.calls.count()).toBe(0);
    expect(utils.createRootElement.calls.allArgs()).toEqual([]);
});
