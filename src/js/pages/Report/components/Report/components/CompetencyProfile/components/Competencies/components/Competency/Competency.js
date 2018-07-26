import { h, Component } from 'preact';

/** @jsx h */

export default class Competency extends Component {

    render() {

        // const { i18n } = this.props;

        // todo: we must check here if some of the required data is available, if nothing: do not render this component

        return (
            <li>
                <span>{ this.props.score }</span>
                <br />
                <br />
                title
                <br />
                desc
            </li>
        );
    }
}
