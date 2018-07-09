import { h, Component } from 'preact';
import style from './style/editglobalcompetencies.scss';
import Listview from '../../../../../../../../components/Listview';

/** @jsx h */

export default class EditGlobalCompetencies extends Component {
    render() {
        const { i18n } = this.props;

        const entities = [
            [
                {
                    type: 'checkbox',
                    key: 'selectParticipantLabel',
                    action: () => {
                        console.log('select');
                    }
                },
                {
                    key: 'name',
                    value: 'value1'
                }
            ],
            [
                {
                    type: 'checkbox',
                    key: 'selectParticipantLabel',
                    action: () => {
                        console.log('select');
                    }
                },
                {
                    key: 'name',
                    value: 'value2'
                }
            ]
        ];

        return (
            <div id="organisations_edit_global_competencies" className={ `${style.tab} hidden` }>
                <main>
                    <Listview
                        entities={ entities }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'desc' }
                        i18n={i18n}
                        translationKeyPrefix={ 'competencies_' }
                    />
                </main>
                <footer>
                    <button
                        class="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ this.props.closeModal }
                    >{ i18n.organisations_close }</button>
                    <button class="action_button" type="button" value="Submit">{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
