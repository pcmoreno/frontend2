import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';
import Redirect from '../../utils/components/Redirect';

/** @jsx h */

import Header from './components/Header/Header';

class Index extends Component {
    constructor(props) {
        super(props);

        this.logoutAction = this.logoutAction.bind(this);
    }

    logoutAction() {
        const api = ApiFactory.get('neon');

        api.getAuthenticator().logout().then(() => {
            render(<Redirect to={'/'} refresh={'true'}/>);
        });
    }

    render() {
        return (
            <Header
                logoutAction={this.logoutAction}
            />
        );
    }
}

export default Index;
