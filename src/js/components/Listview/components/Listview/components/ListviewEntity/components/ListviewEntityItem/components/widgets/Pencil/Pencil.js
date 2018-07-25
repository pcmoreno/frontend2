import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/pencil.scss';

/** @jsx h */

export default class Pencil extends Component {
    render() {
        const { action, disabled } = this.props;

        return (
            <button className={ `${style.pencil}${disabled ? ' disabled' : ''}` } onClick={ action } disabled={ disabled }>
                <FontAwesomeIcon icon={ 'pencil-alt' } />
            </button>
        );
    }
}
