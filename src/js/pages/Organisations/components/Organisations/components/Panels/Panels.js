import { h, Component } from 'preact';

/** @jsx h */

import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

export default class Panels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { panels, pathNodes, fetchEntities, openModalToAddOrganisation } = this.props;

        const panelCollection = [];
        let panelIndex = 1;

        pathNodes.forEach(pathNode => {

            // todo: extract to helper function
            let currentPanel;

            panels.forEach(panel => {
                if (panel.parentId === pathNode.id) {
                    currentPanel = panel;
                }
            });

            panelCollection.push(<Panel
                panelId={ panelIndex++ }
                entities={currentPanel.entities}
                fetchEntities={fetchEntities}
                openModalToAddOrganisation={openModalToAddOrganisation}
                active={ currentPanel.active }
                pathNodes = { pathNodes }
            />);
        });

        return (
            <section className={ style.panels } id="panels">
                { panelCollection }
            </section>
        );
    }
}
