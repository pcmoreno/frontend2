import { h, Component } from 'preact';

/** @jsx h */

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { i18n } = this.props;

        return (
            <div>
                <div className="toolbar">
                    <button
                        onClick={ this.props.openModalToAddParticipant }
                        className="button-action">
                        { i18n.organisations_add_participant }
                    </button>
                </div>
                <div className="scrollable-select-list">
                    list goes here
                </div>
            </div>
        );
    }
}
