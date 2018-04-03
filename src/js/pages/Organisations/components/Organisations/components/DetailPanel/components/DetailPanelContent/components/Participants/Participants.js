import { h, Component } from 'preact';

/** @jsx h */

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="toolbar">
                    <button
                        onClick={ this.props.openModalToAddParticipant }
                        className="button-action">
                        add participant
                    </button>
                </div>
                <div className="scrollable-select-list">
                    list goes here
                </div>
            </div>
        );
    }
}
