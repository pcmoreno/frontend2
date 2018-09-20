import { h, Component } from 'preact';
import Item from './components/Item/Item';
import PanelHeader from './components/PanelHeader/PanelHeader';
import style from './style/panel.scss';

/** @jsx h */

export default class Panel extends Component {
    render() {
        const {
            pathNodes,
            panelId,
            parentType,
            fetchEntities,
            fetchDetailPanelData,
            entities,
            panelHeaderAddMethods,
            i18n
        } = this.props;
        const itemOutput = [];

        if (entities && entities.length > 0) {
            entities.forEach(entity => {

                let isPanelItemActive = false;

                // see if the entity is active (highlighted in the panel)
                pathNodes.forEach(pathNode => {

                    // note you HAVE to check for id AND type: id's are NOT unique between organisations and projects!
                    if (pathNode.id === entity.id && pathNode.type === entity.type) {
                        isPanelItemActive = true;
                    }
                });

                itemOutput.push(<Item
                    entity={ entity }
                    panelId={ panelId }
                    fetchEntities={ fetchEntities }
                    fetchDetailPanelData={ fetchDetailPanelData }
                    isPanelItemActive={ isPanelItemActive }
                    i18n={ i18n }
                />);
            });
        }

        return (
            <section id={ `panel-${panelId}` } className={ style.panel } >
                <PanelHeader
                    panelId={ panelId }
                    parentType={ parentType }
                    addMethods={ panelHeaderAddMethods }
                    i18n={ i18n }
                />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        );
    }
}
