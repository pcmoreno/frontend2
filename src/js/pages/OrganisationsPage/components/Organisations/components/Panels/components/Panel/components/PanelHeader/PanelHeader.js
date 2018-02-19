import { h, Component } from 'preact';
/** @jsx h */

import style from './style/panelheader.scss';

export default class PanelHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={ style.panelHeader } >
                <button type="button" value="Add" onClick={ this.props.openModalToAddOrganisation } >Add</button>
            </div>
        )
    }
}

