import { h, Component } from 'preact';
import PathNode from './components/PathNode/PathNode';
import style from './style/path.scss';

/** @jsx h */

export default class Path extends Component {
    render() {
        const { pathNodes, fetchEntities } = this.props;

        const nodes = [];
        let panelIndex = 0;

        pathNodes.forEach(pathNode => {

            nodes.push(<PathNode
                name={ pathNode.name }
                id={ pathNode.id }
                uuid={ pathNode.uuid }
                type={ pathNode.type }
                section={ pathNode.section }
                panelId={ panelIndex++ }
                fetchEntities={ fetchEntities }
            />);
        });

        return (
            <section className={ style.path } id="path">
                <nav>
                    { nodes }
                </nav>
            </section>
        );
    }
}
