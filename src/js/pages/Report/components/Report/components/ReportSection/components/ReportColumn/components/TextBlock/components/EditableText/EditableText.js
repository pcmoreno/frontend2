import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

import FroalaEditor from 'react-froala-wysiwyg';

export default class EditableText extends Component {

    constructor() {
        super();

        this.localState = {
            editorEnabled: false,
            textEditable: false,
            text: ''
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
        if (document.querySelector(`#${this.props.id}`)) {
            document.querySelector(`#${this.props.id}`).innerHTML = text;
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
    }

    render() {

        // save text in local state first time
        if (!this.localState.text) {
            this.localState.text = this.props.text;
        }

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
            className={ style.editableText }
            id={ this.props.id }
            onClick={this.switchEditor.bind(this)}
            role='textbox'
            tabIndex='0'
        />);
    }
}
