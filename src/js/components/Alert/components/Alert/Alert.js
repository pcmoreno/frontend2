import { h, Component } from 'preact';
/** @jsx h */

import classNames from 'classnames';
import style from './style/alert.scss';

class Alert extends Component {
    constructor() {
        super();
    }

    render() {
        if (this.props.alert && this.props.alert.text) {
            let gradientClass;

            switch (this.props.alert.type) {
                case 'error': gradientClass = 'alert_error'; break;
                case 'warning': gradientClass = 'alert_warning'; break;
                case 'message': gradientClass = 'alert_message'; break;

                default: gradientClass = 'alert_message';
            }

            return (<div className = { classNames(style.alert, gradientClass) } >
                { this.props.alert.text }
            </div>);
        }

        return null;
    }
}

export default Alert;
