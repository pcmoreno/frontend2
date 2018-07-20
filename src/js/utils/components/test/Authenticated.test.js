import { shallow } from 'preact-render-spy';
import Authenticated from '../Authenticated';

test('Should render a div when is authenticated', () => {
    const api = {
        getAuthenticator: () => {
            return {
                isAuthenticated: () => {
                    return true;
                }
            };
        }
    };

    const context = shallow(<Authenticated api={api}>
        <div>Some authenticated component</div>
    </Authenticated>);

    expect(context.find('div')[0].children).toEqual([
        {
            "attributes": undefined,
            "children": [
                "Some authenticated component"
            ],
            "key": undefined,
            "nodeName": "div"
        }
    ]);
});

test('Should not render a div when is not authenticated', () => {
    const api = {
        getAuthenticator: () => {
            return {
                isAuthenticated: () => {
                    return false;
                }
            };
        }
    };

    const context = shallow(<Authenticated api={api}>
        <div>Some authenticated component</div>
    </Authenticated>);

    expect(context.find('div')).toEqual({
        "length": 0
    });
});
