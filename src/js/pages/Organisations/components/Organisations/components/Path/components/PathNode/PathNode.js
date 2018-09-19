import { h, Component } from 'preact';
import style from './style/pathnode.scss';

/** @jsx h */

class PathNode extends Component {
    render() {
        const { name, id, uuid, type, section, panelId, fetchEntities } = this.props;

        return (<span className={ style.node }>
            <a href={ id }
                onClick={ event => {
                    event.preventDefault();
                    fetchEntities({ id, uuid, name, type, section }, panelId);
                }}
            >{ name }</a>
        </span>);
    }
}

export default PathNode;
