import { h, Component } from 'preact';
import style from './style/footer.scss';

/** @jsx h */

export default class Footer extends Component {
    render() {
        return (
            <footer>
                <nav>
                    <button
                        className={ 'action_button action_button__secondary' }
                        type={ 'button' }
                        value={ 'Close' }
                        onClick={ this.handleClose }
                        disabled={ this.props.disabled }
                    >
                        { this.props.i18n.form_close }
                    </button>
                    { this.props.formSubmitButton }
                </nav>
            </footer>
        );
    }
}
