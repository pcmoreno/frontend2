import { h, Component } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style/usermenu.scss';

/** @jsx h */

export default class UserMenu extends Component {
    render() {
        const { user } = this.props;

        return (
            <ul className={ style.user_menu }>
                <li className={ `${style.spinner} hidden` } id="spinner">
                    <FontAwesomeIcon icon="spinner"/>
                </li>
                <li className={ style.user_avatar }>
                    <FontAwesomeIcon icon="user" />
                </li>
                <li className={ style.user_name }>
                    <span>
                        { user.getDisplayName() }
                    </span>
                </li>
                <li className={ style.btn_foldout } id="user_btn_foldout">
                    <FontAwesomeIcon icon="angle-down" />
                </li>
            </ul>
        );
    }
}
