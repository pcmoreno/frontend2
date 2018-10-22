import { h, Component } from 'preact';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import style from './style/editcustomcompetency.scss';
import OrganisationsError from './../../../../../../constants/OrganisationsError';
import CompetencyTab from '../../../../../../constants/CompetencyTab';

/** @jsx h */

export default class EditCustomCompetency extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            editCustomCompetencyForm: {
                competencyName: null,
                competencyDefinition: null
            },
            isSaving: false,
            error: ''
        };

        this.api = ApiFactory.get('neon');

        this.clearFormFields = this.clearFormFields.bind(this);
    }

    onChange(event) {
        event.preventDefault();

        this.localState.editCustomCompetencyForm[event.target.id] = event.target.value;
    }

    clearFormFields() {
        this.localState.editCustomCompetencyForm.competencyName = null;
        this.localState.editCustomCompetencyForm.competencyDefinition = null;

        this.setState(this.localState.editCustomCompetencyForm);
    }

    onSubmit(event) {
        event.preventDefault();

        const competencySlug = this.props.customCompetencyToEdit.slug;
        const competencyName = this.localState.editCustomCompetencyForm.competencyName;
        const competencyDefinition = this.localState.editCustomCompetencyForm.competencyDefinition;

        if (!competencySlug || !competencyName || !competencyDefinition) {
            this.localState.error = this.props.i18n[OrganisationsError.ALL_FIELDS_REQUIRED];
            this.setState(this.localState);
            return;
        }

        if (this.localState.isSaving) {
            return;
        }

        this.localState.isSaving = true;
        this.localState.error = '';
        this.setState(this.localState);

        try {
            this.props.editCustomCompetency(competencySlug, competencyName, competencyDefinition).then(() => {
                this.clearFormFields();
            }).catch(error => {

                let errorMessage = '';

                // always show the first error that was returned from the api
                if (error && error[0]) {
                    errorMessage = this.props.i18n[error[0]] || this.props.i18n.organisations_unexpected_error;
                }

                this.localState.isSaving = false;
                this.localState.error = errorMessage || this.props.i18n[error.message];
                this.setState(this.localState);
            });

        } catch (error) {

            // exception matches Lokalise keys
            this.localState.isSaving = false;
            this.localState.error = this.props.i18n[error.message];
            this.setState(this.localState);
        }
    }

    render() {
        const { i18n, customCompetencyToEdit } = this.props;

        // this is to set or reset the fields, this is handled by the onSwitchTab event in organisations index
        // note the specific check for null, to prevent an emptied competencyName being identified as the initial state
        if (customCompetencyToEdit && this.localState.editCustomCompetencyForm.competencyName === null) {

            // received a competency over props, therefore populating the form for amending
            this.localState.editCustomCompetencyForm.competencyName = customCompetencyToEdit.name;
            this.localState.editCustomCompetencyForm.competencyDefinition = customCompetencyToEdit.definition;
            this.localState.error = '';

        } else if (!customCompetencyToEdit) {

            // emptying localState since no competency received over props, so a new one can be added
            this.localState.editCustomCompetencyForm.competencyName = null;
            this.localState.editCustomCompetencyForm.competencyDefinition = null;
        }

        return (
            <div id={ CompetencyTab.EDIT_CUSTOM_COMPETENCY } className={ `${style.tab} hidden` }>
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
                                    value={ this.localState.editCustomCompetencyForm.competencyName }
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
                                    value={ this.localState.editCustomCompetencyForm.competencyDefinition }
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
                                    this.clearFormFields();
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
                        onClick={ () => {
                            this.clearFormFields();
                            this.props.closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_cancel }</button>
                    <button
                        className="action_button"
                        type="button"
                        onClick={ event => {
                            this.onSubmit(event);
                        } }
                    >{ i18n.organisations_save }</button>
                </footer>
            </div>
        );
    }
}
