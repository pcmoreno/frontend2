import { h, Component } from 'preact';
/** @jsx h */

import PanelHeader from './components/PanelHeader/PanelHeader';
import ItemList from './components/ItemList/ItemList';

export default class Panel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;

        return (
            <div>
                <PanelHeader addOrganisation={ this.props.addOrganisation } />
                <ItemList items = { items } />
            </div>
        )
    }
}

