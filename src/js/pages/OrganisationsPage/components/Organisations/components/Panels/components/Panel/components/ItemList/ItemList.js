import { h, Component } from 'preact';
/** @jsx h */

import Item from './components/Item/Item';

import style from './style/itemlist.scss';

export default class ItemList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;

        let itemOutput;
        itemOutput = items.map(item => {
                return <Item item = { item.organisationName } />
            }
        );

        return (
            <ul className={ style.itemlist }>
                { itemOutput }
            </ul>
        )
    }
}
