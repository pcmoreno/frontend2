import { h, Component } from 'preact';

/** @jsx h */

import Item from './components/Item/Item';
import PanelHeader from './components/PanelHeader/PanelHeader';
import style from './style/panel.scss';

export default class Panel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { items, getChildElements } = this.props;

        let itemOutput = [];

        if (items.length > 1) {
            items.forEach(item => {
                itemOutput.push(<Item
                    itemName = { item.organisation_name }
                    getChildElements = { getChildElements }
                />);
            });
        } else {

            // todo: a single entry is not wrapped inside an array, thus cannot forEach it. fix this in the API.
            itemOutput = <Item
                itemName = { items.organisation_name }
                getChildElements = { getChildElements }
            />;
        }

        return (
            <section className={ `${style.panel} ${this.props.active ? 'active' : ''}` } >
                <PanelHeader openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        );
    }
}
