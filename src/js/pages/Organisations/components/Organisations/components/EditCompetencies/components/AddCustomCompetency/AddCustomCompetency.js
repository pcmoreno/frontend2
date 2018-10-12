import { h, Component } from 'preact';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import style from './style/addcustomcompetency.scss';
import OrganisationsError from './../../../../../../constants/OrganisationsError';
import CompetencyTab from '../../../../../../constants/CompetencyTab';

/** @jsx h */

// todo: these components should be made differently, they are causing troubles as a tab component
// todo: which is actually also a modal and also a conditional input field which is always shown
// todo: thus never hidden, thus never properly reset-able. Same goes for the other tabs like EditCustomCompetency.js
export default class AddCustomCompetency extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            addCustomCompetencyForm: {
                competencyName: null,
                competencyDefinition: null
            },
            isBeingCreated: false,
            error: ''
        };

        this.api = ApiFactory.get('neon');
    }

    onChange(event) {
        event.preventDefault();

        this.localState.addCustomCompetencyForm[event.target.id] = event.target.value;
    }

    clearFormFields() {
        this.localState = {
            addCustomCompetencyForm: {
                competencyName: null,
                competencyDefinition: null
            }
        };

        this.setState(this.localState);
    }

    onSubmit(event) {
        event.preventDefault();

        const competencyName = this.localState.addCustomCompetencyForm.competencyName;
        const competencyDefinition = this.localState.addCustomCompetencyForm.competencyDefinition;

        if (!competencyName || !competencyDefinition) {
            this.localState.error = this.props.i18n[OrganisationsError.ALL_FIELDS_REQUIRED];
            this.setState(this.localState);
            return;
        }

        if (this.localState.isBeingCreated) {
            return;
        }

        this.localState.isBeingCreated = true;
        this.localState.error = '';
        this.setState(this.localState);

        try {
            this.props.addCustomCompetency(competencyName, competencyDefinition).then(() => {
                this.clearFormFields();
                this.localState.isBeingCreated = false;
            }).catch(error => {

                let errorMessage = '';

                // always show the first error that was returned from the api
                if (error && error[0]) {
                    errorMessage = this.props.i18n[error[0]] || this.props.i18n.organisations_unexpected_error;
                }

                this.localState.isBeingCreated = false;
                this.localState.error = errorMessage || this.props.i18n[error.message];
                this.setState(this.localState);
            });

        } catch (error) {

            // exception matches Lokalise keys
            this.localState.isBeingCreated = false;
            this.localState.error = this.props.i18n[error.message];
            this.setState(this.localState);
        }
    }

    componentDidUpdate() {
        const element = document.querySelector(`#${CompetencyTab.ADD_CUSTOM_COMPETENCY}`);

        // todo: this is called too many times. We should think of another way to detect this tab to be hidden
        // this is a primitive way of clearing the attributes when hiding this screen
        if (element.classList.contains('hidden')) {
            this.localState.isBeingCreated = false;
            this.localState.error = '';
            this.localState.addCustomCompetencyForm.competencyDefinition = null;
            this.localState.addCustomCompetencyForm.competencyName = null;
        }
    }

    render() {
        const { i18n } = this.props;

        return (
            <div id={ CompetencyTab.ADD_CUSTOM_COMPETENCY } className={ `${style.tab} hidden` }>
                <main>
                    <form>
                        <main>
                            <div>
                                <label htmlFor="competencyName">{ i18n.organisations_competency_name } *</label>
                                <input
                                    tabIndex="1"
                                    type="text"
                                    id="competencyName"
                                    name="username"
                                    autoComplete="on"
                                    onChange={ event => {
                                        this.onChange(event);
                                    } }
                                    required
                                    value={ this.localState.addCustomCompetencyForm.competencyName }
                                />
                            </div>
                            <div>
                                <label htmlFor="competencyDefinition">{ i18n.organisations_competency_definition } *</label>
                                <textarea
                                    rows="4"
                                    cols="50"
                                    tabIndex="2"
                                    id="competencyDefinition"
                                    autoComplete="off"
                                    onChange={ event => {
                                        this.onChange(event);
                                    } }
                                    required
                                    value={ this.localState.addCustomCompetencyForm.competencyDefinition }
                                />
                            </div>

                            <span className={ style.requiredLabel }>* { i18n.organisations_required_fields }</span>

                            <span className={style.errors}>
                                { this.localState.error }
                            </span>

                            <button
                                className="action_button action_button__secondary left"
                                type="button"
                                onClick={ () => {
                                    this.props.goBackToCustomCompetencySelectionTab();
                                } }
                            >{ i18n.organisations_edit_competencies_back }</button>
                        </main>
                    </form>
                </main>
                <footer>
                    <button
                        className="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ () => {
                            this.clearFormFields();
                            this.props.closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_cancel }</button>
                    <button
                        className="action_button"
                        type="button"
                        value="Submit"
                        onClick={ event => {
                            this.onSubmit(event);
                        } }
                    >{ i18n.organisations_save }</button>
                </footer>
            </div>
        );
    }
}
