import { h, Component } from 'preact';
import style from './style/participantscorerow.scss';

/** @jsx h */

export default class ParticipantScoreRow extends Component {
    render() {
        const { label, score, categoryScore } = this.props;

        return (
            <ul className={ style.list }>
                <li>{ label }</li>
                <li>{ score }</li>
                <li>{ categoryScore }</li>
            </ul>
        );
    }
}
