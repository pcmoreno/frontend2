import { h, Component } from 'preact';
import style from './style/competency.scss';

/** @jsx h */

export default class Competency extends Component {
    render() {
        const { name, score, definition } = this.props;

        // todo: we must check here if some of the required data is available, if nothing: do not render this component

        return (
            <li className={ style.competency }>
                <header>
                    <h2>{ name }</h2>
                    <h3>{ score }</h3>
                </header>
                <article>
                    <p>
                        { definition }
                        </p>
                </article>
            </li>
        );
    }
}
