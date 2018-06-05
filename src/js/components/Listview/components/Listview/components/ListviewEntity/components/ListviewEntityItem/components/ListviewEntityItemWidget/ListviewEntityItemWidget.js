import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/pencil.scss';

/** @jsx h */

export default class ListviewEntityItemWidget extends Component {

    render() {
        const { widgetLabel, widgetAction } = this.props;

        // todo: a widget now always outputs as a pencil icon, make this dynamic by supplying a type and adding a switch here that imports the right component
        return (
            <button onClick={ widgetAction } className={ style.pencil }>
                <FontAwesomeIcon icon={ 'pencil-alt' } />
            </button>
        );
    }
}
