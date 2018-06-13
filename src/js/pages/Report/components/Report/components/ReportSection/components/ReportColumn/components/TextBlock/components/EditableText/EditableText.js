import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

import FroalaEditor from 'react-froala-wysiwyg';

export default class EditableText extends Component {

    constructor(props) {
        super();

        this.localState = {
            newTextField: true,
            waitingForCreation: false,
            slug: props.slug,
            editorEnabled: false,
            textEditable: false,
            text: props.text || ''
        };

        this.froalaConfig = {
            editorClass: style.editableText,
            htmlAllowedTags:
                ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul', 'ol', 'br', 'strong', 'em', 'i', 'u'],
            pastePlain: true,
            spellcheck: true,
            toolbarSticky: false,
            toolbarButtons: [
                'paragraphFormat',
                'bold',
                'italic',
                'underline',
                '|',
                'formatOL',
                'formatUL',
                '|',
                'undo',
                'redo'
            ],
            paragraphFormat: {
                N: 'Normal',
                H4: 'Heading',
                H5: 'Subheading'
            },
            paragraphFormatSelection: true,
            events: {
                'froalaEditor.blur': () => {
                    this.switchEditor();
                },
                'froalaEditor.initialized': (e, editor) => {

                    // call focus so blur events will instantly work. Otherwise you could open multiple editors without focussing them
                    editor.events.focus();
                }
            }
        };
    }

    componentDidMount() {

        // set whether the text is editable
        this.localState.textEditable = this.props.textEditable;

        // prepare current text
        this.setTextElement();
    }

    /**
     * Set the html text on the text element (no editor!)
     * @param {string} text - text
     * @returns {undefined}
     */
    setTextElement(text = this.localState.text) {
        if (document.querySelector(`#report-${this.props.name}`)) {
            document.querySelector(`#report-${this.props.name}`).innerHTML = text;
        }
    }

    /**
     * Switches the editor on/off, if editing is allowed
     * @returns {undefined}
     */
    switchEditor() {
        if (this.localState.textEditable) {
            this.localState.editorEnabled = !this.localState.editorEnabled;
            this.setState(this.localState);
        }
    }

    componentDidUpdate() {

        // rerender html text area as the editor was disabled
        if (!this.localState.editorEnabled) {
            this.setTextElement();
        }
    }

    /**
     * Updates the state with the given text (from Froala editor)
     * On each break from typing, this event is triggered.
     * @param {string} text - text
     * @returns {undefined}
     */
    handleTextChange(text) {
        this.localState.text = text;

        if (!this.localState.slug && this.localState.waitingForCreation) {

            // there is no slug and we already posted before, so do nothing and wait.
            return;
        }

        // store text field slug if available
        if (!this.localState.slug && this.props.slug) {
            this.localState.slug = this.props.slug;
        }

        // if the text field slug is not set, we are going to create a new text field entry. Set this value to make sure
        // that we won't sent multiple post calls
        if (!this.localState.slug) {
            this.localState.waitingForCreation = true;
        }

        // call to save the report text
        this.props.saveReportText(
            this.localState.slug,
            this.props.textFieldTemplateSlug,
            this.localState.text
        ).then(result => {

            // store slug if we didn't have any (when creating a new textFieldInReport)
            if (!this.localState.slug) {
                this.localState.slug = result.slug;
            }

            // we're not waiting anymore...
            this.localState.waitingForCreation = false;

        }, (/* error */) => {

            // we're not waiting anymore...
            // error will be shown by the main report component
            this.localState.waitingForCreation = false;
        });
    }

    render() {

        // render editor or render the text only
        if (this.localState.editorEnabled) {
            return (<FroalaEditor
                tag='textarea'
                config={this.froalaConfig}
                model={this.localState.text}
                onModelChange={this.handleTextChange.bind(this)}
                onBlur={this.switchEditor.bind(this)}
            />);
        }

        // by default render the regular text
        return (<div
            className={ `${style.editableText} ${!this.localState.text.replace(/ |<p>|<\/p>|<br>/g, '') ? style.empty : ''}` }
            id={ `report-${this.props.name}` }
            onClick={this.switchEditor.bind(this)}
            role='textbox'
            tabIndex='0'
        />);
    }
}
