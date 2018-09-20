import { h, Component } from 'preact';
import Listview from '../../../../components/Listview';
import style from './style/participants.scss';

/** @jsx h */

export default class Participants extends Component {
    render() {
        const { participants, i18n } = this.props;

        return (
            <main className={ style.participants }>
                <Listview
                    entities={ participants }
                    defaultSortingKey={ 'assessmentdate' }
                    defaultSortingOrder={ 'desc' }
                    i18n={ i18n }
                    translationKeyPrefix={ 'participants_' }
                />
            </main>
        );
    }
}
