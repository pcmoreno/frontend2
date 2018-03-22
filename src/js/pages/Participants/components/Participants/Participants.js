import { h, Component } from 'preact';

/** @jsx h */

import Participant from './components/Participant/Participant';
import style from './style/participants.scss';

export default class Users extends Component {

    render() {
        const { participants } = this.props;
        const participantsOutput = participants.map(participant => <Participant participant = { participant } />);

        return (
            <section className={ style.participants }>
                { participantsOutput }
            </section>
        );
    }
}
