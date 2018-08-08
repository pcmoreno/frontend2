import { h, Component } from 'preact';
import KeyCodes from '../../../../../../../../constants/KeyCodes';
import { bindActionCreators } from 'redux';
import ApiFactory from '../../../../../../../../utils/api/factory';
import * as alertActions from './../../../../../../../../components/Alert/actions/alert';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/inlineeditabletext.scss';

/** @jsx h */

export default class InlineEditableText extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions),
            dispatch
        );

        this.amendInlineEditable = this.amendInlineEditable.bind(this);
        this.keyPressedWhileAmending = this.keyPressedWhileAmending.bind(this);

        this.api = ApiFactory.get('neon');
    }

    validateEditableText(value) {
        if (value.length < 3 || value.length > 255) {
            this.actions.addAlert({ type: 'error', text: this.i18n.organisations_amend_entity_name_invalid_length });

            return false;
        }

        return true;
    }

    amendInlineEditable(event) {
        event.preventDefault();
        const value = event.currentTarget.value;

        if (this.validateEditableText(value)) {

            // call amending function when change was detected
            if (event.currentTarget.value !== this.props.initialValue) {
                this.props.amendFunction(
                    this.props.amendSectionType,
                    this.props.slug,
                    value,
                    this.props.amendFieldType
                );
            }

            event.currentTarget.blur();
        }
    }

    keyPressedWhileAmending(event) {
        switch (event.keyCode) {

            case KeyCodes.ESCAPE:

                event.currentTarget.value = this.props.initialValue;
                event.currentTarget.blur();
                break;

            case KeyCodes.ENTER:

                event.currentTarget.blur();
                break;

            default:
                break;
        }
    }

    render() {
        const { initialValue } = this.props;
        let readOnly = true;

        if (this.props.slug &&
            this.api.getAuthoriser().authorise(this.api.getAuthenticator().getUser(), 'organisations', 'amendNameAction')
        ) {
            readOnly = false;
        }

        return (
            <div className={ style.amendInlineEditable }>
                <input
                    type="text"
                    name="name"
                    required
                    defaultValue={ initialValue }
                    readOnly={ readOnly }
                    maxLength="255"
                    autoComplete="off"
                    onBlur={ event => {
                        this.amendInlineEditable(event);
                    } }
                    onKeyDown={ event => {
                        this.keyPressedWhileAmending(event);
                    } }
                />
                <span><FontAwesomeIcon icon={ 'pencil-alt' } /></span>
            </div>
        );
    }
}
