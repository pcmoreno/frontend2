import { h, Component } from 'preact';
import style from './style/competencytype.scss';
import AppConfig from '../../../../../../../../../../../App.config.js';

/** @jsx h */

export default class CompetencyType extends Component {
    render() {
        const { competencyType } = this.props;

        let icon;

        switch (competencyType) {
            case 'global': icon = <span className={ style.global }>{ AppConfig.global.organisations.rootEntity.name }</span>;
                break;

            case 'custom': icon = null;
                break;

            default:
                break;
        }

        return (
            <div className={ style.competencyType }>{ icon }</div>
        );
    }
}
