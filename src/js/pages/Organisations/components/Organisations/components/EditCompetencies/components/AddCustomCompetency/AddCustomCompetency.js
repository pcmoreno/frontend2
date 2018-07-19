import { h, Component } from 'preact';
import ApiFactory from '../../../../../../../../utils/api/factory';
import style from './style/addcustomcompetency.scss';

/** @jsx h */

export default class AddCustomCompetency extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            addCustomCompetencyForm: {
                competencyName: null,
                competencyDefinition: null
            }
        };

        this.api = ApiFactory.get('neon');
    }

    onChange(event) {
        event.preventDefault();

        this.localState.addCustomCompetencyForm[event.target.id] = event.target.value;
    }

    onSubmit(event) {
        event.preventDefault();

        const competencyName = this.localState.addCustomCompetencyForm.competencyName;
        const competencyDefinition = this.localState.addCustomCompetencyForm.competencyDefinition;

        // execute login process
        try {
            this.props.addCustomCompetency(competencyName, competencyDefinition).then(() => {
            }).catch(error => {
                // organisations_add_custom_competency_error
                console.log('fout 1: '+error);
            });
        } catch (error) {
            // organisations_add_custom_competency_error
            console.log(error);
        }
    }

    render() {
        const { i18n } = this.props;

        const errors = '';

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
                                    autocomplete="on"
                                    onChange={ event => {
                                        this.onChange(event);
                                    } }
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="competencyDefinition">{ i18n.organisations_competency_definition }</label>
                                <textarea
                                    rows="4"
                                    cols="50"
                                    tabIndex="2"
                                    id="competencyDefinition"
                                    autocomplete="off"
                                    onChange={ event => {
                                        this.onChange(event);
                                    } }
                                    required
                                />
                            </div>
                            <span className={style.errors}>
                                { errors }
                            </span>
                        </main>
                    </form>
                </main>
                <footer>
                    <button
                        class="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ () => {
                            this.props.closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_close }</button>
                    <button
                        class="action_button"
                        type="button"
                        value="Submit"
                        onClick={ () => {
                            this.onSubmit(event);
                        } }
                    >{ i18n.organisations_save }</button>
                </footer>
            </div>
        );
    }
}
