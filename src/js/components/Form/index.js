import { h, Component } from 'preact';
/** @jsx h */

import Form from './components/Form/Form'

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Form />)
    }
}

export default Index;
