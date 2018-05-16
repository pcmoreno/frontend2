import { h, Component } from 'preact';

// todo: translate this

/** @jsx h */

import style from './style/register.scss';

export default class Register extends Component {

    render() {

        // const { onSubmit, handleChange, localState } = this.props;

        // todo: translate text of input fields and labels
        return (
            <div className={ style.register }>
                <section className={ style.registerMargin }>
                    Register component!
                    <div />
                </section>
            </div>
        );
    }
}
