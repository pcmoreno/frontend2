import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as participantsActions from './actions/participants';

import Participants from './components/Participants/Participants';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, participantsActions),
            dispatch
        );
    }

    componentWillMount() {
        document.title = 'Participants';
    }

    render() {
        return (
            <Participants
            />
        );
    }
}

const mapStateToProps = (/* state */) => ({
});

export default connect(mapStateToProps)(Index);
