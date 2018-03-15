import { h, Component } from 'preact';

/** @jsx h */

import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

export default class Panels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { items } = this.props;

        /* todo: note that currently these panels are identical (copies) */

        return (
            <section className={ style.panels } id="panels">
                <Panel items = { items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
                <Panel
                    items = { items }
                    openModalToAddOrganisation={ this.props.openModalToAddOrganisation }
                    active = { true }
                />
            </section>
        );
    }
}
