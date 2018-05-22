import { h, Component } from 'preact';
import LoginForm from './components/LoginForm/LoginForm';

/** @jsx h */

export default class Index extends Component {
    render() {
        const { onSubmit, handleChange, error, buttonDisabled, successMessage } = this.props;

        return (
            <LoginForm
                onSubmit={ onSubmit }
                handleChange={ handleChange }
                error = { error }
                buttonDisabled = { buttonDisabled }
                successMessage = { successMessage }
            />
        );
    }
}
