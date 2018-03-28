import { h, Component } from 'preact';

/** @jsx h */

export default class ListviewEntityItemButton extends Component {
    render() {
        const { buttonLabel, buttonLink, buttonClass } = this.props;

        return (
            <a href={ buttonLink } className={ buttonClass }>{ buttonLabel }</a>
        );
    }
}
