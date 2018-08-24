import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/retesttrigger.scss';

/** @jsx h */

export default class RetestTrigger extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            retestDisabled: false
        };
    }

    componentWillUnmount() {
        this.stopRetestTimeout();
    }

    triggerRetest() {
        this.localState.retestDisabled = true;
        this.setState(this.localState);

        this.props.triggerRetest();
    }

    render() {
        const { i18n } = this.props;

        return (
            <section className={ style.retesttrigger }>
                <h4>{ i18n.report_retest_title }</h4>
                { !this.localState.retestDisabled && <button
                    type="submit"
                    className="action_button light_with_dark_hover"
                    onClick={ () => {
                        this.triggerRetest();
                    } }
                    disabled={ this.localState.retestDisabled }
                >
                    <FontAwesomeIcon icon={ 'sync-alt' } />
                    <span>{ i18n.report_retest_button }</span>
                </button>}

                { this.localState.retestDisabled && <p>{ i18n.report_retest_success_description }</p>}
            </section>
        );
    }
}
