import { h, Component } from 'preact';

/** @jsx h */

import style from './style/textblock.scss';
import EditableText from './components/EditableText/EditableText';

export default class TextBlock extends Component {
    render() {
        const { field, hideTitle, editable, saveReportText } = this.props;

        // todo: implement translated default text

        // validate props
        if (!field) {
            return null;
        }

        return (
            <section className={style.textBlock}>
                <h3>{ !hideTitle && field.title }</h3>
                <EditableText
                    slug={ field.slug }
                    textFieldTemplateSlug={ field.textFieldTemplateSlug }
                    name={ field.name }
                    textEditable={ editable }
                    text={ field.value}
                    saveReportText={saveReportText}
                />
            </section>
        );
    }
}
