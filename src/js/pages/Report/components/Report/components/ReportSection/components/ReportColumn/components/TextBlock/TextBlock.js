import { h, Component } from 'preact';

/** @jsx h */

import style from './style/textblock.scss';
import EditableText from './components/EditableText/EditableText';

export default class TextBlock extends Component {

    render() {
        const { field } = this.props;

        // todo: implement translated default text

        // validate props
        if (!field || !field.name) {
            return null;
        }

        return (
            <section className={style.textBlock}>
                <h3>{ field.name }</h3>
                <EditableText text={field.value || 'todo: implement default (translated) text'}/>
            </section>
        );
    }
}
