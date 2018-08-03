import { h, Component } from 'preact';

/** @jsx h */

import style from './style/textblock.scss';
import EditableText from './components/EditableText/EditableText';

export default class TextBlock extends Component {

    saveReportText(text) {
        const field = this.props.field;

        this.props.saveReportText({
            slug: field.slug,
            textFieldTemplateSlug: field.textFieldTemplateSlug,
            name: field.name,
            value: text
        }, false);
    }

    render() {
        const { field, hideTitle, editable } = this.props;

        // validate props
        if (!field) {
            return null;
        }

        return (
            <section className={ style.textBlock }>
                <h3>{ !hideTitle && field.title }</h3>
                <EditableText
                    name={ field.name }
                    textEditable={ editable }
                    text={ field.value }
                    saveReportText={ this.saveReportText.bind(this) }
                />
            </section>
        );
    }
}
