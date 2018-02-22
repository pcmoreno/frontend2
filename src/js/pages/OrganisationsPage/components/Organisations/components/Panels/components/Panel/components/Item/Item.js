import { h, Component } from 'preact';
/** @jsx h */

import style from './style/item.scss';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    openDetailPanel() {
        document.querySelector('body').classList.add('detailpanel-open');
    }

    render() {
        let { item } = this.props;

        // todo: consider extracting the name_container to a separate component aswell

        return (
            <li>
                <ul className={ style.listitem__items }>
                    <li className={ style.icon }>icon</li>
                    <li className={ style.name_container }>
                        <div>
                            <span className={ style.title }>{ item }</span>
                            <span className={ style.subtitle }></span>
                        </div>
                    </li>
                    <li className={ style.button_show_detailpanel }>
                        <span onClick={ this.openDetailPanel } role="button">O</span>
                    </li>
                </ul>
            </li>
        )
    }
}

