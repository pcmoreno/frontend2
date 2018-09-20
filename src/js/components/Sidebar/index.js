import { h, Component } from 'preact';
import Sidebar from './components/Sidebar/Sidebar';

/** @jsx h */

class Index extends Component {
    render() {
        const { tabs, i18n } = this.props;

        return (
            <Sidebar tabs={ tabs } i18n={i18n} />
        );
    }
}

export default Index;
