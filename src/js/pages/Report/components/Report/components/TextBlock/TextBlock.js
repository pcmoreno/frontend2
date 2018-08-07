import { h, Component } from 'preact';

/** @jsx h */

import style from './style/textblock.scss';
import EditableText from './components/EditableText/EditableText';

export default class TextBlock extends Component {

    componentDidMount() {
        this.isBeingCreated = false;
        this.createdSlug = null; // this is the slug of the field when created in this session
    }

    saveReportText(text) {
        const field = this.props.field;

        // use slug from state, response or null (when it didn't have a slug at all)
        const slugToPost = field.slug || this.createdSlug || null;

        // if there was no slug and we're already creating the entry, do not proceed
        if (!slugToPost && this.isBeingCreated) {
            return;
        }

        // set to being created if there was no slug to post
        this.isBeingCreated = !slugToPost;

        // call to parent to do the api call
        this.props.saveReportText({
            slug: slugToPost,
            textFieldTemplateSlug: field.textFieldTemplateSlug,
            name: field.name,
            value: text
        }, false).then(response => {

            if (response && response.slug) {
                this.createdSlug = response.slug;
            }

            this.isBeingCreated = false;

        }).catch(() => {
            this.isBeingCreated = false;
        });
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
