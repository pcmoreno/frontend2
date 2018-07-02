import { h, Component } from 'preact';
import Message from './components/Message/Message';
import style from './style/inbox.scss';

/** @jsx h */

export default class Inbox extends Component {
    render() {
        const { messages, i18n } = this.props;
        const messagesOutput = [];

        messages.forEach(message => {
            messagesOutput.push(<Message message={ message } i18n={ i18n } />);
        });

        return (
            <main className={ style.inbox }>
                { messagesOutput.length > 0 ? messagesOutput : i18n.inbox_no_messages_for_participant }
            </main>
        );
    }
}
