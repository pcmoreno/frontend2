import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as inboxActions from './actions/inbox';
import * as alertActions from '../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Inbox from './components/Inbox/Inbox';
import ApiFactory from '../../utils/api/factory';
import translator from '../../utils/translator';

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

        // get items for first time
        this.fetchMessages();
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
        }).catch(error => {
            this.actions.addAlert({ type: 'could not connect to API', text: error });
        });
    }


    render() {
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
