import { h, Component } from 'preact';
import FroalaEditor from 'react-froala-wysiwyg';
import ReportComponents from '../../../../../../constants/ReportComponents';
import ReportActions from '../../../../../../constants/ReportActions';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import AppConfig from '../../../../../../../../App.config';
import style from './style/editabletext.scss';

/** @jsx h */

export default class EditableText extends Component {

    constructor(props) {
        super();

        this.localState = {
            newTextField: true,
            waitingForCreation: false,

            // keep track of the user switch to edit mode and back
            editMode: false,

            // keep track of whether the editor was rendered
            // there are issues with froala when updating the state, triggering a re-render of the editor
            // it will completely disappear and break.
            editorRendered: false,
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
        this.isBeingCreated = false;
        this.createdSlug = null; // this is the slug of the field when created in this session
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

        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
            delete this.timeout;
        }

        if (this.saveInterval) {
            window.clearInterval(this.saveInterval);
            this.saveInterval = null;
            delete this.saveInterval;
        }
    }

    componentWillUnmount() {
        this.clearSaveInterval();
    }

    saveReportText() {

        if (this.lastSavedText === this.localState.text) {
            return;
        }

        // use slug from state, response or null (when it didn't have a slug at all)
        const slugToPost = this.props.slug || this.createdSlug || null;

        // if there was no slug and we're already creating the entry, do not proceed
        if (!slugToPost && this.isBeingCreated) {
            return;
        }

        // keep track of the text that we are sending to the api as a status
        this.lastSavedText = this.localState.text;

        // set to being created if there was no slug to post
        this.isBeingCreated = !slugToPost;

        // call to parent to do the api call
        this.props.saveReportText({
            slug: slugToPost,
            templateSlug: this.props.templateSlug,
            name: this.props.name,
            value: this.localState.text
        }, false).then(response => {

            if (response && response.slug) {
                this.createdSlug = response.slug;
            }

            this.isBeingCreated = false;

        }).catch(() => {
            this.isBeingCreated = false;
        });
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
            this.localState.editMode = !this.localState.editMode;

            if (this.localState.editMode) {
                this.setSaveInterval();
            } else {
                this.clearSaveInterval();
                this.saveReportText();
            }

            this.setState(this.localState);
        }
    }

    componentDidUpdate() {

        // (re-)render html text area as the editor was disabled
        if (!this.localState.editMode || !this.localState.editorRendered) {
            this.setTextElement();

            // edit mode was enabled but a state refresh renders the label instead of the editor
            // when a state update triggers a re-render, something else has happened on the page
            if (this.localState.editMode) {

                // no need to update the state here
                this.localState.editMode = false;

                // todo: this is called every update for every component instance
                // todo: this will work because of checks upon saving, but causes redundant calls
                // after an update of this component, and the component is hidden
                // check and eventually save the text and clear the interval
                this.clearSaveInterval();
                this.saveReportText();
            }
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
        // only render the editor when it wasn't already rendered before.
        // when a state update triggers a re-render, something else has happened, so hide the editor.
        if (this.localState.editMode && !this.localState.editorRendered) {
            this.localState.editorRendered = true;
            return (<FroalaEditor
                tag={ 'textarea' }
                config={ this.froalaConfig }
                model={ this.localState.text }
                onModelChange={ this.handleTextChange.bind(this) }
            />);
        }

        // by default render the regular text
        this.localState.editorRendered = false;
        return (<div
            className={ `${style.editableText} ${!this.localState.text.replace(/ |<p>|<\/p>|<br>/g, '') ? style.empty : ''}` }
            id={ `report-${this.props.name}` }
            onClick={ editMethod }
            role="textbox"
            tabIndex="0"
        />);
    }
}
