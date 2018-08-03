import { h, Component } from 'preact';
import style from './style/bulletlist.scss';

/** @jsx h */

export default class Bulletlist extends Component {
    render() {
        const { children } = this.props;

        if (!children) {
            return null;
        }

        return (
            <section className={ style.bulletList }>
                { children }
            </section>
        );
    }
}
