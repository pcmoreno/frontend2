import { h, Component } from 'preact';
import style from './style/editcustomcompetencies.scss';

/** @jsx h */

export default class EditCustomCompetencies extends Component {
    render() {
        return (
            <div id="organisations_edit_custom_competencies" className={ `${style.tab} hidden` }>
                <main>tab2 content, listview etc.</main>
                <footer>
                    <button class="action_button action_button__secondary" type="button" value="Close" onClick={ this.props.closeModalToEditCompetencies }>Annuleren</button>
                    <button class="action_button" type="button" value="Submit">Submit</button>
                </footer>
            </div>
        );
    }
}
