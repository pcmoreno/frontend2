import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/pencil.scss';

/** @jsx h */

export default class Checkbox extends Component {
    render() {
        const { widgetAction } = this.props;

        return (
            <button className={ style.pencil } onClick={ widgetAction }>
                <FontAwesomeIcon icon={ 'pencil-alt' } />
            </button>
        );
    }
}
