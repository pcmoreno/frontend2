import { h, Component } from 'preact';
/** @jsx h */

import classNames from 'classnames';
import style from './style/alert.scss';

class Alert extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.alerts && this.props.alerts.length > 0) {

            // lets start (for now) by taking the last alert off the list
            let alert = this.props.alerts[this.props.alerts.length - 1];
            let gradientClass;

            switch (alert.type) {
                case 'error': gradientClass = 'alert_error'; break;
                case 'warning': gradientClass = 'alert_warning'; break;
                case 'message': gradientClass = 'alert_message'; break;

                default: gradientClass = 'alert_message';
            }

            return (<div className = { classNames(style.alert, gradientClass) } >
                { alert.text }
            </div>);
        }

        return null;
    }
}

export default Alert;
