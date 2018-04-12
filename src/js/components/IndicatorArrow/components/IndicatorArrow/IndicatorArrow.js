import { h, Component } from 'preact';

/** @jsx h */

class IndicatorArrow extends Component {
    constructor() {
        super();
    }

    render() {
        return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 20">
            <path d="M0,2C26,2,34,13.19,40,22.33,47,13.06,54,2,80,2V0H0Z" />
            <path d="M0,0C26,0,34,10.19,40,19.33,47,10.06,54,0,80,0Z" />
        </svg>
        );
    }
}

export default IndicatorArrow;
