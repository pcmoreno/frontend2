import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';
import Redirect from '../../utils/components/Redirect';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as headerActions from './actions/header';
import translator from '../../utils/translator';
import Header from './components/Header/Header';

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

        // set language in state (so components update and dropdown can be populated)
        this.actions.switchLanguage(languageId);
    }

    render() {
        const { user } = this.props;

        if (!user) {
            return null;
        }

        /* todo: translations for the header should reside in its own translation file, or general, or menu */
        return (
            <Header
                user={user}
                logoutAction={this.logout}
                languageId={this.props.languageId}
                switchLanguage={this.switchLanguage}
                i18n={ translator(this.props.languageId, 'inbox') }
            />
        );
    }
}

const mapStateToProps = state => ({
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
