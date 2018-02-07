import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as organisationsActions from './actions/organisations'

import Organisations from './components/Organisations/Organisations'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, organisationsActions),
            dispatch
        );
    }

    componentWillMount() {
        document.title = 'Organisations';
    }

    render() {
        return (
            <Organisations
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

export default connect(mapStateToProps)(Index);
