import { h, Component } from 'preact';
import style from './style/message.scss';

/** @jsx h */

class Message extends Component {
    render() {
        const { name } = this.props;

        return (
            <ul className={ style.messages }>
                <li>
                    <div className={ style.message }>
                        <article className={ style.participantsSummary }>
                            <h3>{ name }</h3>
                            <p>De Persona.fit resultaten zijn gebaseerd op de vragenlijst die je hebt ingevuld.
                                Klik op 'Ga naar Persona.fit' om jouw resultaten te zien.</p>
                        </article>
                        <section className={ style.participantsData }>
                            <h4>LTP</h4>
                            <div>
                                <div className={ style.participantsAction }>
                                    <a className="action_button" href="#notimplemented">
                                        Ga naar Persona.fit
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </li>
            </ul>
        );
    }
}

export default Message;
