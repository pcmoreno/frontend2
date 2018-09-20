import { h, Component } from 'preact';
import style from './style/scorebar.scss';

/** @jsx h */

export default class ScoreBar extends Component {
    render() {
        const { i18n, score, fill } = this.props;
        const scores = [];

        // set the values to fill the progress bar or not
        if (fill) {
            for (let i = 1; i <= 5; i++) {
                if (score >= i) {
                    scores[i - 1] = style.fill;
                } else {
                    scores[i - 1] = style.blank;
                }
            }
        } else {
            for (let i = 1; i <= 5; i++) {
                if (score >= i && score < (i + 1)) {
                    scores[i - 1] = style.fill;
                } else {
                    scores[i - 1] = style.blank;
                }
            }
        }

        return (
            <section className={ style.scoreBar }>
                <section className={ `${style.legend} hidden` }>
                    <span>{ i18n.report_low }</span>
                    <span>{ i18n.report_high }</span>
                </section>
                <div>
                    <svg version="1.0" x="0px" y="0px" viewBox="0 0 508 20">
                        <g>
                            <rect rx="8" ry="8" x="0" y="0" width="100" height="20" className={ scores[0] } />
                            <rect rx="8" ry="8" x="102" y="0" width="100" height="20" className={ scores[1] } />
                            <rect rx="8" ry="8" x="204" y="0" width="100" height="20" className={ scores[2] } />
                            <rect rx="8" ry="8" x="306" y="0" width="100" height="20" className={ scores[3] } />
                            <rect rx="8" ry="8" x="408" y="0" width="100" height="20" className={ scores[4] } />
                        </g>
                    </svg>
                </div>
            </section>
        );
    }
}
