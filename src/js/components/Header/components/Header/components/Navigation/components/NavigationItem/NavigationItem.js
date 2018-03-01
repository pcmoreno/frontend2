import { h, Component } from 'preact';
/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/navigationitem.scss';

export default class navigationItem extends Component {
    constructor() {
        super();
    }

    render() {
        let { label, link } = this.props;

        return (
            <li className={ style.navigation_item }><a href={ link }><FontAwesomeIcon icon="users" />{ label }</a></li>
        )
    }
}
