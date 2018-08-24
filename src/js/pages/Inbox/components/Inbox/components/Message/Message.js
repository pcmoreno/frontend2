import { h, Component } from 'preact';
import style from './style/message.scss';

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
        const { message, i18n } = this.props;

        let finishBefore;

        const participantSessionSlug = message.participantSessionSlug;

        if (message.appointmentDate) {
            finishBefore = <div>{ i18n.inbox_complete_before }: { message.appointmentDate }</div>;
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
                                    { i18n.inbox_start }
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
