import { h, Component } from 'preact';
/** @jsx h */

export default class TextInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { handle, label } = this.props;

        return (<div>
                <label htmlFor={ handle }>{ label }</label>
                <input type="text" id={ handle } value={ handle }  name={ 'form['+handle+']'} />
            </div>
        )
    }
}

