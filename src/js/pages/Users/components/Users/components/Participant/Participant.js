import { h, Component } from 'preact';
import style from './style/participant.scss';

/** @jsx h */

export default class Participant extends Component {
    render() {
        return (
            <span className={ style.participant }>
                participant
            </span>
        );
    }
}
