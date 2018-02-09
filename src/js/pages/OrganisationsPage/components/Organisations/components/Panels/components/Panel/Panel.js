import { h, Component } from 'preact';
/** @jsx h */

import ItemList from './components/ItemList/ItemList';

export default class Panel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;

        return (
            <ItemList items = { items } />
        )
    }
}

