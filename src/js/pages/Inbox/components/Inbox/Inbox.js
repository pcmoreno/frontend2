import { h, Component } from 'preact';

/** @jsx h */

import style from './style/inbox.scss';

export default class Inbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className={ style.inbox }>
                <ul className={ style.messages }>
                    <li>
                        <div className={ style.message }>
                            <article className={ style.participantsSummary }>
                                <h3>Bekijk jouw Persona.fit</h3>
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
            </main>
        );
    }
}
