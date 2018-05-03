import { h, Component } from 'preact';

/** @jsx h */

import Sidebar from './components/Sidebar/Sidebar';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tabs, i18n } = this.props;

        return (
            <Sidebar tabs={ tabs } i18n={i18n} />
        );
    }
}

export default Index;
