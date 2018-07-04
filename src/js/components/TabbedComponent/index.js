import { h, Component } from 'preact';
import TabbedComponent from './components/TabbedComponent/TabbedComponent';

/** @jsx h */

export default class Index extends Component {

    render() {
        return (<TabbedComponent
            children={ this.props.children }
            activeTab={ this.props.activeTab }
        />);
    }
}
