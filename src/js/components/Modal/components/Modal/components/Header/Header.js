import { h, Component } from 'preact';

/** @jsx h */

export default class Header extends Component {
    render() {
        return (
            <header>
                <button
                    type="button"
                    value="Close"
                    onClick={ this.handleClose }
                    disabled={ this.props.disabled }>
                    <span aria-hidden="true">×</span>
                </button>
                <h3>{ this.props.headerText }</h3>
                { this.props.subNavigation }
                { this.props.errors }
            </header>
        );
    }
}
