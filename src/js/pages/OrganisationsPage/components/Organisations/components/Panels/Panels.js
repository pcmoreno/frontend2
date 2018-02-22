import { h, Component } from 'preact';
/** @jsx h */

import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

export default class Panels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;

        // todo: introduce logic here to go through all panels that should be displayed. for now just repeating.

        return (
            <section className={ style.panels }>
                <Panel items = { items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
                <Panel items = { items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
            </section>
        )
    }
}

