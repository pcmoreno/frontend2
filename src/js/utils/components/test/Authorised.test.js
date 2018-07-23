import { shallow } from 'preact-render-spy';
import Authorised from '../Authorised';

test('Should render a div when is authorised', () => {
    const api = {
        getAuthenticator: () => {
            return {
                getUser: () => {
                    return {};
                }
            };
        },
        getAuthoriser: () => {
            return {
                authorise: () => {
                    return true;
                }
            };
        }
    };

    const context = shallow(<Authorised api={api} component='report' action='writeAction'>
        <div>Some widget(s) to write reports</div>
    </Authorised>);

    expect(context.find('div')[0].children).toEqual([
        {
            "attributes": undefined,
            "children": [
                "Some widget(s) to write reports"
            ],
            "key": undefined,
            "nodeName": "div"
        }
    ]);
});

test('Should not render a div when is not Authorised', () => {
    const api = {
        getAuthenticator: () => {
            return {
                getUser: () => {
                    return {};
                }
            };
        },
        getAuthoriser: () => {
            return {
                authorise: () => {
                    return false;
                }
            };
        }
    };

    const context = shallow(<Authorised api={api} component='report' action='writeAction'>
        <div>Some widget(s) to write reports</div>
    </Authorised>);

    expect(context.find('div')).toEqual({
        "length": 0
    });
});
