import { h, Component } from 'preact';

/** @jsx h */

import style from './style/column.scss';

export default class Column extends Component {

    render() {
        const { children } = this.props;

        return (
            <section className={style.column}>
                { children }
            </section>
        );
    }
}
