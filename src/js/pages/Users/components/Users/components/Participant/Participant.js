import { h, Component } from 'preact';

/** @jsx h */

import style from './style/participant.scss';

export default class Participant extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <span className={ style.participant }>
                participant
            </span>
        );
    }
}
