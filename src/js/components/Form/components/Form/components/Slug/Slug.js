import { h, Component } from 'preact';
/** @jsx h */

export default class Slug extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { handle } = this.props;

        return (<div>
                <label htmlFor={ handle }>Slug</label>
                <input type="text" id={ handle } value={ handle } />
            </div>
        )
    }
}

