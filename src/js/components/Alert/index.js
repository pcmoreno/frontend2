import { h, Component } from 'preact';
/** @jsx h */

import Alert from './components/Alert/Alert'

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Alert alert = { this.props.alert } />)
    }
}

export default Index;
