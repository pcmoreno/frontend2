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
        let { items } = this.props;

        let itemOutput;
        itemOutput = items.map(item => {
                return <Item item = { item.organisationName } />
            }
        );

         // todo: add 'active' class to section

        return (
            <section className={ style.panel } >
                <PanelHeader openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        )
    }
}

