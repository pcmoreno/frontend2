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
        const { items } = this.props;
        const itemOutput = items.map(item => <Item item = { item.organisationName } />);

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
