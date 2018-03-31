import { h, Component } from 'preact';

/** @jsx h */

import style from './style/pathnode.scss';

class PathNode extends Component {
    constructor() {
        super();
    }

    render() {
        const { name, id, type, section, panelId, fetchEntities } = this.props;

        return (<span className={ style.node }>
            <a href={ id } onClick={ event => {
                event.preventDefault();
                fetchEntities({ id, name, type, section }, panelId - 1);
            }}>{ name }</a>
        </span>);
    }
}

export default PathNode;
