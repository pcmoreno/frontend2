import { h, Component } from 'preact';
import style from './style/main.scss';

/** @jsx h */

export default class Main extends Component {
    render() {

        return (
            <main className={ style.main }>
                { this.props.content }
            </main>
        );
    }
}
