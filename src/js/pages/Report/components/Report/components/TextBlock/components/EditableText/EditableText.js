import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

import FroalaEditor from 'react-froala-wysiwyg';
import ReportComponents from '../../../../../../constants/ReportComponents';
import ReportActions from '../../../../../../constants/ReportActions';
import ApiFactory from '../../../../../../../../utils/api/factory';
import AppConfig from '../../../../../../../../App.config';

export default class EditableText extends Component {

    constructor(props) {
        super();

        this.localState = {
            newTextField: true,
            waitingForCreation: false,
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

        this.api = ApiFactory.get('neon');
    }

    componentDidMount() {

        // set whether the text is editable
        this.localState.textEditable = this.props.textEditable;

        // prepare current text
        this.setTextElement();

        this.lastSavedText = this.localState.text;
    }

    setSaveInterval() {

        // set an interval to check changes every x seconds and trigger update calls
        this.timeout = window.setTimeout(() => {
            this.saveInterval = window.setInterval(() => {
                this.saveReportText();
            }, AppConfig.report.textSaveInterval);
        }, 1000);
    }

    clearSaveInterval() {
        window.clearTimeout(this.timeout);
        window.clearInterval(this.saveInterval);

        this.timeout = null;
        delete this.timeout;

        this.saveInterval = null;
        delete this.saveInterval;
    }

    componentWillUnmount() {
        this.clearSaveInterval();
    }

    saveReportText() {
        if (this.lastSavedText !== this.localState.text) {
            this.props.saveReportText(this.localState.text);
            this.lastSavedText = this.localState.text;
        }
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

            if (this.localState.editorEnabled) {
                this.setSaveInterval();
            } else {
                this.clearSaveInterval();
                this.saveReportText();
            }

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
     * Stores the changed text value from the editor
     * @param {string} text - text
     * @returns {undefined}
     */
    handleTextChange(text) {
        this.localState.text = text;
    }

    render() {
        let editMethod = false;

        // check if this user is authorized to edit report texts
        if (this.api.getAuthoriser().authorise(this.api.getAuthenticator().getUser(), ReportComponents.REPORT_COMPONENT, ReportActions.WRITE_ACTION)) {
            editMethod = this.switchEditor.bind(this);
        }

        // render editor or render the text only
        if (this.localState.editorEnabled) {
            return (<FroalaEditor
                tag='textarea'
                config={ this.froalaConfig }
                model={ this.localState.text }
                onModelChange={ this.handleTextChange.bind(this) }
                onBlur={ this.switchEditor.bind(this) }
            />);
        }

        // by default render the regular text
        return (<div
            className={ `${style.editableText} ${!this.localState.text.replace(/ |<p>|<\/p>|<br>/g, '') ? style.empty : ''}` }
            id={ `report-${this.props.name}` }
            onClick={ editMethod }
            role='textbox'
            tabIndex='0'
        />);
    }
}