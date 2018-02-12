import { h, Component } from 'preact';
/** @jsx h */

export default class PanelHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                panel header
                <button type="button" value="Add" onClick={ this.props.addOrganisation } />
            </div>
        )
    }
}

