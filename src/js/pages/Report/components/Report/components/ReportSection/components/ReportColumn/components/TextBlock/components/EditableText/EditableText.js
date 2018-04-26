import { h, Component } from 'preact';

/** @jsx h */

import style from './style/editabletext.scss';

export default class EditableText extends Component {

    componentDidMount() {
        if (document.querySelector('#' + this.props.id)) {
            document.querySelector('#' + this.props.id).innerHTML = this.props.text;
        }
    }
    render() {
        return (
            <section className={ style.editableText } id={ this.props.id } />
        );
    }
}
