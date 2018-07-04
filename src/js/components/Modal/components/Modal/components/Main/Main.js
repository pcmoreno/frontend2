import { h, Component } from 'preact';
import style from './style/main.scss';

/** @jsx h */

export default class Main extends Component {
    render() {

        // todo: determine which form, - contained inside this.props.content, to show

        return (
            <main>
                { this.props.content }
            </main>
        );
    }
}
