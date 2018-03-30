import { h, Component } from 'preact';

/** @jsx h */

export default class DetailpanelContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { activeTab } = this.props;

        return (
            <p>content for {activeTab} goes here</p>
        );
    }
}
