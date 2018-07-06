import { h, Component } from 'preact';
import style from './style/editglobalcompetencies.scss';

/** @jsx h */

export default class EditGlobalCompetencies extends Component {
    render() {
        const { i18n } = this.props;

        return (
            <div id="organisations_edit_global_competencies" className={ `${style.tab} hidden` }>
                <main>tab1 content, listview etc.</main>
                <footer>
                    <button
                        class="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ this.props.closeModal }
                    >{ i18n.organisations_close }</button>
                    <button class="action_button" type="button" value="Submit">{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
