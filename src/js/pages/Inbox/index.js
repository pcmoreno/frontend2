import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as inboxActions from './actions/inbox';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Inbox from './components/Inbox/Inbox';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, inboxActions),
            dispatch
        );

        this.api = ApiFactory.get('neon');
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getInboxMessages();
    }

    componentWillMount() {
        document.title = 'Inbox';
    }

    getInboxMessages() {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        // request participants
        this.api.get(
            this.api.getBaseUrl(),
            this.api.getEndpoints().inbox.messages,
            {
                urlParams: {
                    identifiers: {
                        accountSlug: this.api.getAuthenticator().getUser().getId()
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.getParticipants(response);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }


    render() {
        return (
            <Inbox
            />
        );
    }
}

const mapStateToProps = state => ({
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
