import { h, Component } from 'preact';
import style from './style/addcustomcompetency.scss';

/** @jsx h */

export default class AddCustomCompetency extends Component {
    render() {
        return (
            <div id="organisations_add_custom_competency" className={ `${style.tab} hidden` }>
                <main>tab3 content, form etc.</main>
                <footer>
                    <button class="action_button action_button__secondary" type="button" value="Close" onClick={ this.props.closeModalToEditCompetencies }>Annuleren</button>
                    <button class="action_button" type="button" value="Submit">Submit</button>
                </footer>
            </div>
        );
    }
}
