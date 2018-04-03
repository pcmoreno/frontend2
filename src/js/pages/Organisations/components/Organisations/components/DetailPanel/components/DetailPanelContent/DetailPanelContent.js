import { h, Component } from 'preact';

/** @jsx h */

export default class DetailPanelContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { activeTab } = this.props;

        return (
            <p>content for {activeTab} tab goes here</p>
        );
    }
}
