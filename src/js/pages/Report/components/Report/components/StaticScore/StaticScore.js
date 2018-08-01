import { h, Component } from 'preact';
import style from './style/staticscore.scss';
import ScoreBar from '../ScoreBar/ScoreBar';
import ScoreWidgetType from '../../../../constants/ScoreWidgetType';
import ScoreFan from '../ScoreFan/ScoreFan';

/** @jsx h */

export default class StaticScore extends Component {

    render() {
        const { score, scoreCount, title, scoreWidgetType, htmlDescription, leftText, rightText, footerAppendix } = this.props;
        let scoreWidget = null;
        let footerWidget = null;

        switch (scoreWidgetType) {
            case ScoreWidgetType.SCORE_BAR:
                scoreWidget = <ScoreBar
                    score={ score }
                    count={ scoreCount }
                />;
                break;
            case ScoreWidgetType.SCORE_FAN:
                scoreWidget = <ScoreFan
                    score={ score }
                    count={ scoreCount }
                    leftText={ leftText }
                    rightText={ rightText }
                />;
                break;
            default:
                break;
        }

        // walk through the two dimensional array of footer items
        if (footerAppendix) {
            footerWidget = [];

            footerAppendix.forEach(footerItems => {
                const tableRows = [];

                footerItems.forEach(footerItem => {
                    if (footerItem.title || footerItem.description) {
                        tableRows.push(
                            <tr>
                                <td>
                                    <strong>{ footerItem.title }</strong><br/>
                                    { footerItem.description }
                                </td>
                            </tr>
                        );
                    }
                });

                if (tableRows.length) {
                    footerWidget.push(
                        <table>
                            <tbody>
                                { tableRows }
                            </tbody>
                        </table>
                    );
                }
            });
        }

        return (
            <div>
                <div className={ style.staticScore }>
                    <h3>{ title }</h3>
                    <section className={ style.scoreContainer }>
                        { scoreWidget }
                    </section>
                    <section className={ style.textContainer }>
                        <div
                            dangerouslySetInnerHTML={{ __html: htmlDescription }}
                        />
                    </section>
                </div>
                { footerWidget && <div className={ style.footer }>
                    { footerWidget }
                </div>}
            </div>
        );
    }
}
