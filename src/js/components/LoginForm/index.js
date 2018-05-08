import { h, Component } from 'preact';
import LoginForm from './components/LoginForm/LoginForm';

/** @jsx h */

export default class Index extends Component {
    render() {
        const { onSubmit, handleChange, localState } = this.props;

        return (
            <LoginForm
                onSubmit={ onSubmit }
                handleChange={ handleChange }
                localState={ localState }
            />
        );
    }
}
