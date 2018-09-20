import { h, Component } from 'preact';
import style from './style/staticscore.scss';
import ScoreBar from '../ScoreBar/ScoreBar';
import ScoreWidgetType from '../../../../constants/ScoreWidgetType';
import ScoreFan from '../ScoreFan/ScoreFan';

/** @jsx h */

/**
 * Renders a Static score widget
 * @example
 * <StaticScore>
 *     score={1} // optional
 *     min={1} // required
 *     max={4} // required
 *     title={'Widget title'} // required
 *     scoreWidgetType={ScoreWidgetType.SCORE_BAR} // required
 *     htmlDescription={'<p>description text</p>'} // optional
 *     leftText={'left/low indicator text'} // optional
 *     rightText={'right/high indicator text'} // optional
 *     footerAppendix={[
 *         [
 *             {
 *                 title: 'title',
 *                 description: 'desc'
 *             }
 *         ],
 *         [
 *             ...
 *         ]
 *     ]} // optional two-dimensional array, title and description are also optional
 * </StaticScore>
 */
export default class StaticScore extends Component {

    render() {
        const { score, min, max, title, scoreWidgetType, htmlDescription, leftText, rightText, footerAppendix } = this.props;
        let scoreWidget = null;
        let footerWidget = null;

        if (!scoreWidgetType) {
            throw new Error('ScoreWidgetType is required');
        }

        switch (scoreWidgetType) {
            case ScoreWidgetType.SCORE_BAR:
                scoreWidget = <ScoreBar
                    score={ score }
                    min={ min }
                    max={ max }
                />;
                break;
            case ScoreWidgetType.SCORE_FAN:
                scoreWidget = <ScoreFan
                    score={ score }
                    min={ min }
                    max={ max }
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
                <div className={ `${style.staticScore} ${footerWidget ? style.footerVisible : ''}` }>
                    <h3>{ title }</h3>
                    <section className={ style.scoreContainer }>
                        { scoreWidget }
                    </section>
                    <section className={ style.textContainer }>
                        <div
                            dangerouslySetInnerHTML={ { __html: htmlDescription } }
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
