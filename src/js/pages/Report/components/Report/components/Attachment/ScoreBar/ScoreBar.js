import { h, Component } from 'preact';
import style from './style/scorebar.scss';

/** @jsx h */

export default class ScoreBar extends Component {
    render() {
        const { i18n, score } = this.props;

        return (
            <section className={ style.scoreBar }>
                <section className={`${style.legend} hidden`}>
                    <span>{ i18n.report_low }</span>
                    <span>{ i18n.report_high }</span>
                </section>
                <div>
                    <svg version="1.0" x="0px" y="0px" viewBox="0 0 508 20">
                        <g>
                            <rect rx="8" ry="8" x="0" y="0" width="100" height="20" className={ score > 0 ? style.fill : style.blank } />
                            <rect rx="8" ry="8" x="102" y="0" width="100" height="20" className={ score > 1 ? style.fill : style.blank } />
                            <rect rx="8" ry="8" x="204" y="0" width="100" height="20" className={ score > 2 ? style.fill : style.blank } />
                            <rect rx="8" ry="8" x="306" y="0" width="100" height="20" className={ score > 3 ? style.fill : style.blank } />
                            <rect rx="8" ry="8" x="408" y="0" width="100" height="20" className={ score > 4 ? style.fill : style.blank } />
                        </g>
                    </svg>
                </div>
            </section>
        );
    }
}
