import { h, Component } from 'preact';
/** @jsx h */

import style from './style/item.scss';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    openDetailPanel() {
        document.querySelector('#detailpanel').classList.remove('hidden');
    }

    render() {
        let { item } = this.props;

        // todo: consider extracting the name_container to a separate component
        // todo: add fontawesome icons

        return (
            <li>
                <ul className={ style.listitem__items }>
                    <li>icon</li>
                    <li className={ style.name_container }>
                        <div>
                            <span className={ style.title }>{ item }</span>
                            <span className={ style.subtitle }>product type</span>
                        </div>
                    </li>
                    <li>
                        <span onClick={ this.openDetailPanel } role="button">O</span>
                    </li>
                </ul>
            </li>
        )
    }
}

