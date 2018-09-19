import { h, Component } from 'preact';
import style from './style/textblock.scss';
import EditableText from './components/EditableText/EditableText';

/** @jsx h */

export default class TextBlock extends Component {

    render() {
        const { field, hideTitle, editable, saveReportText } = this.props;

        // validate props
        if (!field) {
            return null;
        }

        return (
            <section className={ style.textBlock }>
                <h3>{ !hideTitle && field.title }</h3>
                <EditableText
                    slug={ field.slug }
                    templateSlug={ field.templateSlug }
                    name={ field.name }
                    textEditable={ editable }
                    text={ field.value }
                    saveReportText={ saveReportText }
                />
            </section>
        );
    }
}
