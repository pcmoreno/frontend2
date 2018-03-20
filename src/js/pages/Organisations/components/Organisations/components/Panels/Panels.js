import { h, Component } from 'preact';

/** @jsx h */

import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

export default class Panels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { panels, getChildElements, openModalToAddOrganisation } = this.props;

        const panelCollection = [];

        panels.forEach(panel => {
            panelCollection.push(<Panel
                items={panel.entities}
                getChildElements={getChildElements}
                openModalToAddOrganisation={openModalToAddOrganisation}
                active={ panel.active }
            />);
        });

        return (
            <section className={ style.panels } id="panels">
                { panelCollection }
            </section>
        );
    }
}
