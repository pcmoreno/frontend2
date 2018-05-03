import { h, Component } from 'preact';

/** @jsx h */

import style from './style/panelheader.scss';

export default class PanelHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {i18n} = this.props;
        return (
            <nav className={ style.add_button }>
                <button onClick={ this.props.openModalToAddOrganisation }>{i18n.add}</button>
            </nav>
        );
    }
}
