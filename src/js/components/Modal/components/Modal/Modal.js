import { h, Component } from 'preact';
import style from './style/modal.scss';

/** @jsx h */

export default class Modal extends Component {
    render() {

        let header = null;

        if (this.props.modalHeader) {
            header = <header>
                <button type="button" value="Close">
                <span aria-hidden="true">×</span>
                </button>
                <h3>{ this.props.modalHeader }</h3>
            </header>
        }

        return (
            <aside id={ this.props.id } className={ `${style.modal_container}` }>
                <section role="dialog">
                    <section tabIndex="0" className={ style.background } onClick={ this.props.closeModal } role="button">
                        { header }
                        { this.props.content } />
                    </section>
                </section>
            </aside>
        );
    }
}
