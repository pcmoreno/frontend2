import { h, Component } from 'preact';
import style from './style/editglobalcompetencies.scss';
import Listview from '../../../../../../../../components/Listview';

/** @jsx h */

export default class EditGlobalCompetencies extends Component {
    render() {
        const { i18n } = this.props;

        // get available competencies by organisation slug
        // http://dev.ltponline.com:8000/api/v1/section/organisation/slug/000023a3-7997-4f27-a067-b94c5faad0e9?fields=organisationName,selectedCompetencies,competencyName,id,translationKey
        // onderscheid custom en global kan op basis van aanwezigheid translation key





        // get selected competencies by organisation slug
        // http://dev.ltponline.com:8000/api/v1/section/project/slug/f3bdaeb1-f1e6-4615-b211-60dc9a1d1a81?fields=competencies,organisation,organisationName,competencyName,id,translationKey
        // onderscheid custom en global kan op basis van aanwezigheid translation key

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
