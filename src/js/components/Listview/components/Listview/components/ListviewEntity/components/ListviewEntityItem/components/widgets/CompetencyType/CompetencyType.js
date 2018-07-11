import { h, Component } from 'preact';
import style from './style/competencytype.scss';

/** @jsx h */

export default class CompetencyType extends Component {
    render() {
        const { competencyType } = this.props;

        let icon;

        switch (competencyType) {
            case 'global': icon = <span className={ style.global }>LTP</span>;
                break;

            case 'custom': icon = <span />;
                break;

            default:
                break;
        }

        return (
            <div className={ style.competencyType }>{ icon }</div>
        );
    }
}
