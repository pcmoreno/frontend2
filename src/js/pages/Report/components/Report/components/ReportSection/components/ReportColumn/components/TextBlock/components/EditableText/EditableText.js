import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

export default class EditableText extends Component {

    render() {
        const { text } = this.props;

        // todo: text should be translated

        return (
            <section className={style.editableText}>
                { text }
            </section>
        );
    }
}
