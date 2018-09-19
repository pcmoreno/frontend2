import { h, Component } from 'preact';
import style from './style/alert.scss';

/** @jsx h */

class Alert extends Component {
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
                <h5>{ alert.text }</h5>
            </div>);
        }

        return null;
    }
}

export default Alert;
