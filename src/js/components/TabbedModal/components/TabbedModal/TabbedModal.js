import { h, Component } from 'preact';
import style from './style/tabbedmodal.scss';
import Form from './../../../../components/Form';
import FormMethod from '../../../../components/Form/components/Form/constants/FormMethod';

/** @jsx h */

export default class TabbedModal extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            activeForm: null
        };

        this.switchForm = this.switchForm.bind(this);
    }

    switchForm(formId) {
        this.localState.activeForm = formId;
        this.setState(this.localState);
    }

    render() {
        const { closeModalToEditCompetences, i18n, languageId } = this.props;

        let form;

        switch (this.localState.activeForm) {
            default:
            case 'assignGlobalCompetences':
                form = <Form
                    formId={'assignGlobalCompetences'}
                    sectionId={'SOMESECTION'}
                    method={FormMethod.UPDATE_SECTION}
                    headerText={'assign global competences'}
                    submitButtonText={'select'}
                    afterSubmit={() => {
                        console.log('afterSubmit')
                    }}
                    closeModal={closeModalToEditCompetences}
                    languageId={languageId}
                    subNavigationNodes={[{label: 'assignGlobalCompetences'}, {label: 'assignCustomCompetences'}]}
                    switchForm={ this.switchForm }
                />;
                break;

            case 'assignCustomCompetences':
                form = <Form
                    formId={'assignCustomCompetences'}
                    sectionId={'SOMESECTION'}
                    method={FormMethod.UPDATE_SECTION}
                    headerText={'assign global competences'}
                    submitButtonText={'select'}
                    afterSubmit={() => {
                        console.log('afterSubmit')
                    }}
                    closeModal={closeModalToEditCompetences}
                    languageId={languageId}
                    subNavigationNodes={[{label: 'assignGlobalCompetences'}, {label: 'assignCustomCompetences'}, {label: 'addCustomCompetency'}]}
                    switchForm={ this.switchForm }
                />;
                break;

            case 'addCustomCompetency':
                form = <Form
                    formId={'addCustomCompetency'}
                    sectionId={'SOMESECTION'}
                    method={FormMethod.UPDATE_SECTION}
                    headerText={'assign global competences'}
                    submitButtonText={'select'}
                    afterSubmit={() => {
                        console.log('afterSubmit')
                    }}
                    closeModal={closeModalToEditCompetences}
                    languageId={languageId}
                    subNavigationNodes={[{label: 'assignGlobalCompetences'}, {label: 'assignCustomCompetences'}]}
                    switchForm={ this.switchForm }
                />;
                break;
        }

        return (<aside className={ `${style.modal_container} hidden` } id="modal_edit_competences">
            <ul>
                <li>
                    { form }
                </li>
            </ul>
        </aside>);
    }
}
