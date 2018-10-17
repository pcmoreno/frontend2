import { h, Component } from 'preact';
import style from './style/message.scss';
import translator from 'neon-frontend-utils/src/translator';

/** @jsx h */

class Message extends Component {
    constructor(props) {
        super(props);

        this.startingQuestionnaire = this.startingQuestionnaire.bind(this);
        this.localState = {
            buttonDisabled: false
        };
    }

    startingQuestionnaire(event, participantSessionSlug) {
        event.preventDefault();

        // disable the button to avoid bashing
        this.localState.buttonDisabled = true;
        this.setState(this.localState);

        this.props.startQuestionnaire(participantSessionSlug);
    }

    render() {
        const { message } = this.props;

        // ensure each message is presented in the chosen language of the participant when its invitation was created
        const inboxMessage = message.languageId.replace('-', '_') || message.languageId;
        const i18nInboxMessage = translator(inboxMessage, ['inbox']);

        let finishBefore;

        const participantSessionSlug = message.participantSessionSlug;

        if (message.appointmentDate) {
            finishBefore = <div>{ i18nInboxMessage.inbox_complete_before }: { message.appointmentDate }</div>;
        }

        return (
            <ul className={ style.messages }>
                <li>
                    <div className={ style.message }>
                        <article className={ style.participantsSummary }>
                            <h3>{ i18nInboxMessage.inbox_invitation }</h3>
                            <p>{ i18nInboxMessage.inbox_invitation_description_text }</p>
                        </article>
                        <section className={ style.participantsData }>
                            <h4>{ message.organisationName }</h4>
                            { finishBefore }
                            <div className={ style.participantsAction }>
                                <button
                                    type="submit"
                                    className="action_button"
                                    disabled={ this.localState.buttonDisabled }
                                    onClick={
                                        event => this.startingQuestionnaire(event, participantSessionSlug)
                                    }
                                >
                                    { i18nInboxMessage.inbox_start }
                                </button>
                            </div>
                        </section>
                    </div>
                </li>
            </ul>
        );
    }
}

export default Message;
