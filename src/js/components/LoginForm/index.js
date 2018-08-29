import { h, Component } from 'preact';
import LoginForm from './components/LoginForm/LoginForm';
import translator from '../../utils/translator';

/** @jsx h */

export default class Index extends Component {
    render() {
        const { onSubmit, handleChange, error, buttonDisabled, successMessage, language, username, getUsername } = this.props;

        return (
            <LoginForm
                onSubmit={ onSubmit }
                handleChange={ handleChange }
                username={ username }
                getUsername={ getUsername }
                error = { error }
                buttonDisabled = { buttonDisabled }
                successMessage = { successMessage }
                i18n = { translator(language, 'login') }
            />
        );
    }
}
