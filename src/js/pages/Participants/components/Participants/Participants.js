import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import style from './style/participants.scss';

export default class Participants extends Component {
    render() {
        const { participants } = this.props;

        return (
            <main className={ style.participants }>
                <Listview
                    entities={ participants }
                    defaultSortingKey={ 'assessmentdate' }
                    defaultSortingOrder={ 'desc' }
                />
            </main>
        );
    }
}
