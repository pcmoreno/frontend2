import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as inboxActions from './actions/inbox';
import * as alertActions from '../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Inbox from './components/Inbox/Inbox';
import ApiFactory from '../../utils/api/factory';
import translator from '../../utils/translator';
import InboxActions from './constants/InboxActions';
import InboxComponents from './constants/InboxComponents';

/** @jsx h */

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions, inboxActions),
            dispatch
        );

        this.api = ApiFactory.get('neon');
        this.i18n = translator(this.props.languageId, 'inbox');
    }

    componentDidMount() {
        updateNavigationArrow();

        // only load this for a participant
        if (this.api.getAuthoriser().authorise(this.api.getAuthenticator().getUser(), InboxComponents.INBOX_COMPONENT, InboxActions.LOAD_ACTION)) {

            // get items for first time
            this.fetchMessages();
        }
    }

    componentWillMount() {
        document.title = 'Inbox';
    }

    fetchMessages() {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        // fetch messages
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

            this.actions.fetchMessages(response.messages);
        }).catch(() => {
            this.actions.addAlert({ type: 'error', text: this.i18n.inbox_could_not_process_your_request });
        });
    }


    render() {
        this.i18n = translator(this.props.languageId, 'inbox');

        return (
            <Inbox
                messages={ this.props.messages }
                i18n={ this.i18n }
            />
        );
    }
}

const mapStateToProps = state => ({
    languageId: state.headerReducer.languageId,
    messages: state.inboxReducer.messages
});

export default connect(mapStateToProps)(Index);
