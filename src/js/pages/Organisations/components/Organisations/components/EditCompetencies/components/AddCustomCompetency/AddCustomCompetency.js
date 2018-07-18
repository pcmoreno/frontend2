import { h, Component } from 'preact';
import style from './style/addcustomcompetency.scss';

/** @jsx h */

export default class AddCustomCompetency extends Component {
    render() {
        const { i18n } = this.props;

        return (
            <div id="organisations_add_custom_competency" className={ `${style.tab} hidden` }>
                <main>tab3 content: form</main>
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
                            this.props.addCustomCompetency(i18n.organisations_add_custom_competency_success);
                        } }
                    >{ i18n.organisations_save }</button>
                </footer>
            </div>
        );
    }
}
