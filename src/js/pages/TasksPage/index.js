import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as tasksActions from './actions/tasks';
import Tasks from './components/Tasks/Tasks';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, tasksActions),
            dispatch
        );
    }

    componentWillMount() {
        document.title = 'Tasks';
    }

    render() {
        return (
            <Tasks
            />
        );
    }
}

const mapStateToProps = (/* state */) => ({

});

export default connect(mapStateToProps)(Index);
