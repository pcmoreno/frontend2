import { h, Component } from 'preact';
/** @jsx h */

import PanelHeader from './components/PanelHeader/PanelHeader';
import ItemList from './components/ItemList/ItemList';

import style from './style/panel.scss';

export default class Panel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;

        return (
            <div className={ style.panel } >
                <PanelHeader openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
                <ItemList items = { items } />
            </div>
        )
    }
}

