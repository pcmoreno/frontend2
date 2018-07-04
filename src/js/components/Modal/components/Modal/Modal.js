import { h, Component } from 'preact';
import style from './style/modal.scss';

/** @jsx h */

export default class Modal extends Component {
    render() {

        let header = null;

        if (this.props.modalHeader) {
            header = <header className={ style.modal_header }>
                <button type="button" value="Close" className={ style.modal_close_gadget }>
                    <span aria-hidden="true" onClick={ this.props.closeModal }>×</span>
                </button>
                <h3>{ this.props.modalHeader }</h3>
            </header>;
        }

        /* todo: add hidden */

        return (
            <aside id={ this.props.id } className={ `${style.modal_container}` }>
                <section role="dialog">
                    <section tabIndex="0" className={ style.modal_background } onClick={ this.props.closeModal } role="button" />
                    <aside className={ style.modal }>
                        { header }
                        { this.props.children }
                    </aside>
                </section>
            </aside>
        );
    }
}
