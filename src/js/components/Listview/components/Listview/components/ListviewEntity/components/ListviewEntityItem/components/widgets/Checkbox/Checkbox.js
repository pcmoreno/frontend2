import { h, Component } from 'preact';
import style from './style/checkbox.scss';

/** @jsx h */

export default class Checkbox extends Component {
    render() {
        const { widgetAction, checked } = this.props;

        return (
            <span className={ style.checkbox }>
                <input id="checkbox" type="checkbox" checked={ checked } onClick={ widgetAction } />
            </span>
        );
    }
}
