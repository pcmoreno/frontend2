import { h, Component } from 'preact';
import ApiFactory from '../../../../../../../../utils/api/factory';
import style from './style/addcustomcompetency.scss';
import OrganisationsError from './../../../../../../constants/OrganisationsError';

/** @jsx h */

export default class AddCustomCompetency extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            addCustomCompetencyForm: {
                competencyName: null,
                competencyDefinition: null
            },
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

        try {
            this.props.addCustomCompetency(competencyName, competencyDefinition).then(() => {
                this.clearFormFields();
            }).catch(error => {

                let errorMessage = '';

                // always show the first error that was returned from the api
                if (error && error[0]) {
                    errorMessage = this.props.i18n[error[0]];
                }

                this.localState.error = errorMessage || this.props.i18n[error.message];
                this.setState(this.localState);
            });

        } catch (error) {

            // exception matches Lokalise keys
            this.localState.error = this.props.i18n[error.message];
            this.setState(this.localState);
        }
    }

    render() {
        const { i18n } = this.props;

        return (
            <div id="organisations_add_custom_competency" className={ `${style.tab} hidden` }>
                <main>
                    <form>
                        <main>
                            <div>
                                <label htmlFor="competencyName">{ i18n.organisations_competency_name }</label>
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
                                <label htmlFor="competencyDefinition">{ i18n.organisations_competency_definition }</label>
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
                            <span className={style.errors}>
                                { this.localState.error }
                            </span>
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
