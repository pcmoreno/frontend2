import { h, Component } from 'preact';

/** @jsx h */

import style from './style/section.scss';

export default class Section extends Component {

    render() {
        const { title, children } = this.props;

        // todo: title should be translated

        return (
            <section className={style.section}>
                <h2>{ title }</h2>

                {/* child columns are supported with css auto width up to 4 columns of equal width */}
                <div className={style.autoWidth}>
                    { children }
                </div>
            </section>
        );
    }
}
