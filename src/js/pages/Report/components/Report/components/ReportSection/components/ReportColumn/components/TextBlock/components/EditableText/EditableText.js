import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

import FroalaEditor from 'react-froala-wysiwyg';

export default class EditableText extends Component {

    constructor() {
        super();

        this.localState = {
            editorEnabled: false,
            textEditable: false
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
            paragraphFormatSelection: true
        };
    }

    componentDidMount() {
        let text = this.props.text;

        // set whether the text is editable
        this.localState.textEditable = this.props.textEditable;

        if (!text) {
            text = '';
        }

        if (document.querySelector(`#${this.props.id}`)) {
            document.querySelector(`#${this.props.id}`).innerHTML = text;
        }
    }

    switchEditor() {

        // switch editor on/off when text is editable
        if (this.localState.textEditable) {
            this.localState.editorEnabled = !this.localState.editorEnabled;
            this.setState(this.localState);
        }
    }

    // handleTextChange(model) {
    //     console.log('text change: ', model);
    // }

    render() {

        // render editor or render the text only
        if (this.localState.editorEnabled) {
            return (<FroalaEditor
                tag='textarea'
                config={this.froalaConfig}
                model={this.props.text}

                // onModelChange={this.handleTextChange}
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
