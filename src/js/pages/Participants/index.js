import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as participantsActions from './actions/participants';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Participants from './components/Participants/Participants';
import translator from '../../utils/translator';
import { ProductSlugs } from '../../constants/Products';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, participantsActions, alertActions),
            dispatch
        );
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getParticipants();
    }

    componentWillMount() {
        document.title = 'Participants';
    }

    getParticipants() {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        // request participants
        api.get(
            api.getBaseUrl(),
            api.getEndpoints().participants.entities,
            {
                urlParams: {
                    identifiers: {
                        filter: 'project:product:slug'
                    },
                    parameters: {

                        // filter on our 3 hna products
                        value: [
                            ProductSlugs.DEVELOPMENT,
                            ProductSlugs.SELECTION,
                            ProductSlugs.SELECTION_DEVELOPMENT
                        ].join(','),
                        fields: 'uuid,participantSessionAppointmentDate,accountHasRole,genericRoleStatus,account,firstName,infix,lastName,consultant,project,organisation,organisationName,organisationType',
                        limit: 10000
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
            <Participants
                participants = { this.props.participants }
                i18n = { translator(this.props.languageId, 'participants') }
            />
        );
    }
}

const mapStateToProps = state => ({
    participants: state.participantsReducer.participants,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
