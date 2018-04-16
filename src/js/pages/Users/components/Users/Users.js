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
            openModalToAddUser
        } = this.props;

        const tabs = [];

        return (
            <section className={ `${style.users} full_width_sidebar` } id="listview_with_sidebar">
                <section className={ style.listview_container } id="listview_container">
                    <button className={ 'action_button '} onClick={ openModalToAddUser }>+ Add user</button>
                    <Listview
                        entities={ users }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'desc' }
                    />
                </section>
                <Sidebar tabs={ tabs } />
                <aside className={ `${style.modal_container} hidden` } id="modal_user">
                    <Form
                        formId={ 'user' }
                        ignoredFields={ [
                            'uuid'
                        ] }
                        forms = { forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        afterSubmit = { refreshDataWithMessage }
                        closeModal={ closeModalToAddUser }
                    />
                </aside>
            </section>
        );
    }
}
