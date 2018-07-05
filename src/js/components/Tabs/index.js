import { h, Component } from 'preact';
import Tabs from './components/Tabs/Tabs';

/** @jsx h */

export default class Index extends Component {

    render() {
        return (<Tabs
            children={ this.props.children }
            i18n={ this.props.i18n }
        />);
    }
}
