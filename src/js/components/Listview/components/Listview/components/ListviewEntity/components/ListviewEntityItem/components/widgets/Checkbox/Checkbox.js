import { h, Component } from 'preact';
import style from './style/checkbox.scss';

/** @jsx h */

export default class Checkbox extends Component {
    render() {
        const { action, checked, disabled } = this.props;

        return (
            <span className={ `${style.checkbox}${disabled ? ' disabled' : ''}` }>
                <input
                    type="checkbox"
                    checked={ checked }
                    onClick={ action }
                    disabled={ disabled }
                />
            </span>
        );
    }
}
