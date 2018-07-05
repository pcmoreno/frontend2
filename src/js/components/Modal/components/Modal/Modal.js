import { h, Component } from 'preact';
import style from './style/modal.scss';

/** @jsx h */

/**
 * Modal component
 * Creates modal as an aside that uses composition to render the provided children
 *
 * @example
 * <Modal
 *   i18n={ i18n }
 *   id={ 'some-identifier' }
 *   modalHeader={ i18n.identifier_of_translated_header }
 *   closeModal={ () => someMethodToCloseTheModal('someArg') }
 * ><SomeComponent><div>something else</div></Modal>
 *
 * @param {Object} i18n - i18n object
 * @param {string} id - identifier that is put on the aside and eases closing / styling
 * @param {string} modalHeader - value to show as header text
 * @param {Function} closeModal - method to call when user clicks outside the area
 * @returns {*} Modal
 */
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

        return (
            <aside id={ this.props.id } className={ `${style.modal_container} hidden` }>
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
