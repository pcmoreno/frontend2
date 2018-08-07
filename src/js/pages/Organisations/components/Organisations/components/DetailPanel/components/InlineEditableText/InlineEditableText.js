import { h, Component } from 'preact';
import KeyCodes from '../../../../../../../../constants/KeyCodes';
import ApiFactory from '../../../../../../../../utils/api/factory';
import style from './style/inlineeditabletext.scss';

/** @jsx h */

export default class InlineEditableText extends Component {
    constructor(props) {
        super(props);

        this.amendInlineEditable = this.amendInlineEditable.bind(this);
        this.keyPressedWhileAmending = this.keyPressedWhileAmending.bind(this);

        this.api = ApiFactory.get('neon');
    }

    amendInlineEditable(event) {
        event.preventDefault();

        // call parent method if value is different from initial (when user did not opt out of amending using escape)
        if (event.currentTarget.value !== this.props.initialValue) {
            this.props.amendFunction(
                this.props.amendSectionType,
                this.props.slug,
                event.currentTarget.value,
                this.props.amendFieldType
            );
        }

        event.currentTarget.blur();
    }

    keyPressedWhileAmending(event) {
        switch (event.keyCode) {

            case KeyCodes.ESCAPE:

                /* escape */
                event.currentTarget.value = this.props.initialValue;
                event.currentTarget.blur();
                break;

            case KeyCodes.ENTER:

                /* enter */
                event.currentTarget.blur();
                break;

            default:

                /* entering text */
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
            <input
                className={ style.amendInlineEditableField }
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
        );
    }
}
