import { h, Component } from 'preact';
import Message from './components/Message/Message';
import style from './style/inbox.scss';

/** @jsx h */

export default class Inbox extends Component {
    render() {
        const messages = [
            { name: 'some name' },
            { name: 'another name' }
        ];

        const messagesOutput = [];

        messages.forEach(message => {
            messagesOutput.push(<Message name={ message.name } />);
        });

        return (
            <main className={ style.inbox }>
                { messagesOutput }
            </main>
        );
    }
}
