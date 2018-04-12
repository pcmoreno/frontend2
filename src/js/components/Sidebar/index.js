import { h, Component } from 'preact';

/** @jsx h */

import Sidebar from './components/Sidebar/Sidebar';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tabs } = this.props;

        return (
            <Sidebar tabs={ tabs } />
        );
    }
}

export default Index;
