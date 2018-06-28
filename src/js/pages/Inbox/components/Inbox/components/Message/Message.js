import { h, Component } from 'preact';
import style from './style/message.scss';

/** @jsx h */

class Message extends Component {
    render() {
        const { message, i18n } = this.props;

        // todo: filter out persona.fit messages by message.type and/or ensure they appear in a different design

        let startButton = <div className={ style.participantsAction }>
            <a className="action_button disabled" href="#notimplemented">
                (link invalid)
            </a>
        </div>;

        if (message.ssoLink && message.ssoLink !== 'Something went wrong with the API call') {
            startButton = <div className={ style.participantsAction }>
                <a className="action_button" href={ message.ssoLink }>
                    { i18n.inbox_start }
                </a>
            </div>;
        }

        let finishBefore;

        if (message.appointmentDate) {
            finishBefore = <div>{ i18n.inbox_complete_before }: { message.date }</div>;
        }

        return (
            <ul className={ style.messages }>
                <li>
                    <div className={ style.message }>
                        <article className={ style.participantsSummary }>
                            <h3>{ i18n.inbox_invitation }</h3>
                            <p>{ i18n.inbox_invitation_description_text }</p>
                        </article>
                        <section className={ style.participantsData }>
                            <h4>{ message.projectName }</h4>
                            { finishBefore }
                            <div>{ startButton }</div>
                        </section>
                    </div>
                </li>
            </ul>
        );
    }
}

export default Message;
