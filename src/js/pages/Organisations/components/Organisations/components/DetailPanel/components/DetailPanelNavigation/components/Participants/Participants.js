import { h, Component } from 'preact';

/** @jsx h */

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { active, switchTab } = this.props;

        return (
            <li
                className={ active && 'active' }
                onClick={ () => {
                    switchTab('participants');
                }}
            >
                <span>Participants</span>
            </li>
        );
    }
}
