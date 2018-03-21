import { h, Component } from 'preact';

/** @jsx h */

import PathNode from './components/PathNode/PathNode';
import style from './style/path.scss';

export default class Path extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { pathNodes } = this.props;

        let nodes = [];

        pathNodes.forEach(pathNode => {
            nodes.push(<PathNode
                name = { pathNode.name }
                id = { pathNode.id }
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
