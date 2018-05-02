import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';
import Redirect from '../../utils/components/Redirect';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as headerActions from './actions/header';
import Header from './components/Header/Header';
import { setLanguage } from '../../utils/lokaliser.js';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, headerActions),
            dispatch
        );

        this.logout = this.logout.bind(this);
        this.switchLanguage = this.switchLanguage.bind(this);
    }

    logout() {
        const api = ApiFactory.get('neon');

        api.getAuthenticator().logout().then(() => {
            render(<Redirect to={'/'} refresh={true}/>);
        });
    }

    switchLanguage(languageId) {

        // set language id in translation util
        setLanguage(languageId);

        // set language in state (so components update and dropdown can be populated)
        this.actions.switchLanguage(languageId);
    }

    render() {
        const { user } = this.props;

        if (!user) {
            return null;
        }

        return (
            <Header
                user={user}
                logoutAction={this.logout}
                switchLanguage={this.switchLanguage}
            />
        );
    }
}

const mapStateToProps = state => ({
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
