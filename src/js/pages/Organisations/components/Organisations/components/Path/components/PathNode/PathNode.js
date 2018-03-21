import { h, Component } from 'preact';

/** @jsx h */

import style from './style/pathnode.scss';

class PathNode extends Component {
    constructor() {
        super();
    }

    render() {
        const { name, id } = this.props;

        // todo: make nodes clickable
        return (<span className={ style.node }><a href={ id }>{ name }</a></span>);
    }
}

export default PathNode;
