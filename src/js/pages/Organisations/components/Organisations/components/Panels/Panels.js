import { h, Component } from 'preact';
import Logger from '../../../../../../utils/logger';
import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

/** @jsx h */

export default class Panels extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
    }

    render() {
        const {
            panels,
            pathNodes,
            fetchEntities,
            fetchDetailPanelData,
            panelHeaderAddMethods,
            i18n
        } = this.props;

        const panelCollection = [];
        let panelIndex = 0;

        // for each of the nodes in path, find the matching panel in panels and add it to the collection for output
        pathNodes.forEach(pathNode => {
            let currentPanel;

            panels.forEach(panel => {

                // note you HAVE to check for id AND type: id's are NOT unique between organisations and projects!
                if (panel.parentId === pathNode.id && panel.parentType === pathNode.type) {
                    currentPanel = panel;
                }
            });

            // be sure to check if currentPanel was found (for projects there wont be any panel data stored in state)
            if (currentPanel) {
                panelCollection.push(<Panel
                    panelId={ panelIndex }
                    panelHeaderAddMethods = { panelHeaderAddMethods }
                    entities={ currentPanel.entities }
                    parentId={ currentPanel.parentId }
                    parentType={ currentPanel.parentType }
                    fetchEntities={ fetchEntities }
                    fetchDetailPanelData={ fetchDetailPanelData }
                    pathNodes={ pathNodes }
                    i18n={ i18n }
                />);
            }

            panelIndex++;
        });

        return (
            <section className={ style.panels } id="panels">
                { panelCollection }
            </section>
        );
    }
}
