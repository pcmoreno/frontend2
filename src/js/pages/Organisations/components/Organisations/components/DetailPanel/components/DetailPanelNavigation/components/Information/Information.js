import { h, Component } from 'preact';

/** @jsx h */

export default class Information extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { active, switchTab } = this.props;

        return (
            <li
                className={ active && 'active' }
                onClick={ () => {
                    switchTab('information');
                }}
            >
                <span>Info</span> {/* todo: translate this */}
            </li>
        );
    }
}
