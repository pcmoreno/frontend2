import { h, Component } from 'preact';
/** @jsx h */

import style from './style/form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<form className={ style.form }>
            form builder goes here
        </form>)
    }
}
