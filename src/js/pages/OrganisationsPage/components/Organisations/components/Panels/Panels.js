import { h, Component } from 'preact';
/** @jsx h */

import Panel from './components/Panel/Panel';

export default class Panels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;

        return (
            <Panel items = { items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
        )
    }
}

