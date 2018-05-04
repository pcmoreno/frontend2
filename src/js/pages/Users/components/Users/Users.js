import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import Sidebar from './../../../../components/Sidebar';
import Form from './../../../../components/Form';
import style from './style/users.scss';

export default class Users extends Component {
    render() {
        const {
            users,
            forms,
            refreshDataWithMessage,
            closeModalToAddUser,
            changeFormFieldValueForFormId,
            storeFormDataInFormsCollection,
            openModalToAddUser,
            i18n
        } = this.props;

        const tabs = [];

        return (
            <main className={ `${style.users} full_width_sidebar` } id="page_with_sidebar">
                <section className={ style.page_with_sidebar_container } id="page_with_sidebar_container">
                    <button className={ 'action_button '} onClick={ openModalToAddUser }>+ {i18n.add_user}</button>
                    <Listview
                        entities={ users }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'desc' }
                        i18n={i18n}
                    />
                </section>
                <Sidebar tabs={ tabs } />
                <aside className={ `${style.modal_container} hidden` } id="modal_user">
                    <Form
                        formId={ 'account' }
                        ignoredFields={ [
                            'uuid'
                        ] }
                        forms = { forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        afterSubmit = { refreshDataWithMessage }
                        closeModal={ closeModalToAddUser }
                        i18n={i18n}
                    />
                </aside>
            </main>
        );
    }
}
