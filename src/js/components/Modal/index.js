import { h, Component } from 'preact';

/** @jsx h */

import Modal from './components/Modal/Modal';

export default class Index extends Component {
    render() {
        return (<Modal
            id={ this.props.id }
            closeModal={ this.props.closeModal }
            children={ this.props.children }
            modalHeader={ this.props.modalHeader }
        />);
    }
}
