import { h, Component } from 'preact';

/** @jsx h */

export default class Button extends Component {
    render() {
        const { link, disabled } = this.props;
        let label = this.props.label;

        if (this.props.i18n && this.props.translationKeyPrefix) {
            const translatedLabel = this.props.i18n[`${this.props.translationKeyPrefix}${this.props.label}`];

            if (translatedLabel) {
                label = translatedLabel;
            }
        }

        return (
            <a
                href={ link }
                className={ `action_button${disabled ? ' disabled' : ''}` }
                disabled={ disabled }
            >
                { label }
            </a>
        );
    }
}
