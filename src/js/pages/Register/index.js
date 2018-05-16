import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';
import Terms from './components/Terms/Terms';
import Logger from '../../utils/logger';
import Redirect from '../../utils/components/Redirect';
import Register from './components/Register/Register';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';

/** @jsx h */

const invitationAccepted = 'invitationAccepted';
const invited = 'invited';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            participantSessionId: null,
            termsApproved: null,
            languageId: '',
            approvalCheckboxChecked: false,
            approvalButtonDisabled: true
        };

        this.api = ApiFactory.get('neon');
    }

    componentDidMount() {

        // check if there was a user logged in, if so, logout and refresh the page
        if (this.api.getAuthenticator().isAuthenticated()) {
            this.api.getAuthenticator().logout().then(() => {

                // logout successful, refresh this page
                render(<Redirect to={window.location.pathname} refresh={true}/>);
            }, error => {
                Logger.instance.error(`Could not logout on register page: ${error}`);
            });

            return;
        }

        // check terms approval status
        if (this.localState.participantSessionId && this.localState.termsApproved === null) {
            this.checkTermsApprovalStatus(this.localState.participantSessionId);
        }
    }

    checkTermsApprovalStatus(participantSessionId) {

        // request participant session data for terms approval status
        this.api.get(
            this.api.getBaseUrl(),
            this.api.getEndpoints().register.participantStatus,
            {
                urlParams: {
                    identifiers: {
                        slug: participantSessionId
                    }
                }
            }
        ).then(response => {

            // convert given language to frontend usable language (e.g. nl-NL to nl_NL)
            this.localState.languageId = Utils.convertParticipantLanguage(response.language);

            // check the terms accepted status
            switch (response.status) {
                case invited:
                    this.localState.termsApproved = false;
                    break;
                case invitationAccepted:
                    this.localState.termsApproved = true;
                    break;
                default:
                    break;
            }

            this.setState(this.localState);

        }).catch(error => {

            Logger.instance.error(`Could not retrieve status for participantSessionId: ${participantSessionId}, error given: ${error}`);

            // todo: show an error message? Because in this situation, the page stays blank.
        });
    }

    approveTerms(evt) {
        evt.preventDefault();

        if (this.localState.approvalCheckboxChecked) {

            // disable button to avoid bashing
            this.localState.approvalButtonDisabled = true;
            this.setState(this.localState);

            // todo: implement API call that will store the participant session status
        }
    }

    onChangeTermsApproval(evt) {
        evt.preventDefault();

        // save checkbox state and enable or disable the next button
        this.localState.approvalCheckboxChecked = evt.target.checked;
        this.localState.approvalButtonDisabled = !this.localState.approvalCheckboxChecked;
        this.setState(this.localState);
    }

    render() {
        let component = null;

        // retrieve report data by URL parameters
        this.localState.participantSessionId = this.props.matches.participantSessionId;

        // do not render when we don't have participant id or don't know the approval status
        if (!this.localState.participantSessionId ||
            !this.localState.languageId ||
            this.localState.termsApproved === null) {

            return null;
        }

        // render terms component when they were not approved yet
        if (!this.localState.termsApproved) {
            component = <Terms
                i18n = { translator(this.localState.languageId, 'terms') }
                approveTerms = { this.approveTerms.bind(this) }
                handleChange = { this.onChangeTermsApproval.bind(this) }
                buttonDisabled = { this.localState.approvalButtonDisabled }
            />;
        } else {
            component = <Register
                i18n = { translator(this.localState.languageId, 'report') }
            />;
        }

        // return the correct register component
        return component;
    }
}
