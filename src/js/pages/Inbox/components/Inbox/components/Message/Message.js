import { h, Component } from 'preact';
import style from './style/message.scss';

/** @jsx h */

class Message extends Component {
    render() {
        const { name } = this.props;

        return (
            <p className={ style.message }>{ name }</p>
        );
    }
}

export default Message;
