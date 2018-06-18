import { h, Component } from 'preact';
import style from './style/checkbox.scss';

/** @jsx h */

export default class Checkbox extends Component {
    render() {
        const { widgetAction, checked, disabled } = this.props;

        return (
            <span className={ `${style.checkbox}${disabled ? ' disabled' : ''}` }>
                <input id="checkbox" type="checkbox" checked={ checked } onClick={ widgetAction } disabled={ disabled }/>
            </span>
        );
    }
}
