import { h, Component } from 'preact';

/** @jsx h */

import style from './style/alert.scss';

class Alert extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.alerts && this.props.alerts.length > 0) {

            // take the last alert of the list and display it (no stacking yet)
            const alert = this.props.alerts[this.props.alerts.length - 1];
            let gradientClass;

            switch (alert.type) {
                case 'error':
                    gradientClass = 'alert_error';
                    break;
                case 'warning':
                    gradientClass = 'alert_warning';
                    break;
                case 'message':
                    gradientClass = 'alert_message';
                    break;

                default:
                    gradientClass = 'alert_message';
            }

            return (<div className = { `${style.alert} ${gradientClass}` } >
                <h6>{ alert.text }</h6>
            </div>);
        }

        return null;
    }
}

export default Alert;
