import { h, Component } from 'preact';

/** @jsx h */

export default class Slug extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { handle, label, onChange, value } = this.props;

        return (<div>
            <label htmlFor={ handle }>{ label }</label>
            <input
                type="text"
                id={ handle }
                value={ value }
                name={ 'form[' + handle + ']'}
                onChange={ onChange }
            />
        </div>
        );
    }
}
