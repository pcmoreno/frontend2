import { h, Component } from 'preact';

/** @jsx h */

import style from './style/participant.scss';

export default class Users extends Component {

    render() {
        const { participant } = this.props;

        return (
            <span className = { style.participant }>{ participant.id }</span>
        );
    }
}
