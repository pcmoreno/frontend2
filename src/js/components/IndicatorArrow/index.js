import { h, Component } from 'preact';

/** @jsx h */

import IndicatorArrow from './components/IndicatorArrow/IndicatorArrow';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IndicatorArrow />
        );
    }
}

export default Index;
