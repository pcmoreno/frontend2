import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

export default class EditableText extends Component {
    componentDidMount() {
        let text = this.props.text;

        if (!text) {
            text = '';
        }

        if (document.querySelector(`#${this.props.id}`)) {
            document.querySelector(`#${this.props.id}`).innerHTML = text;
        }
    }

    render() {
        return (
            <section className={ style.editableText } id={ this.props.id } />
        );
    }
}
