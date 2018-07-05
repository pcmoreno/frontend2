import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import Sidebar from './../../../../components/Sidebar';

import Form from './../../../../components/Form';
import style from './style/users.scss';
import FormMethod from '../../../../components/Form/components/Form/constants/FormMethod';

export default class Users extends Component {
    render() {
        const {
            users,
            refreshDataWithMessage,
            closeModalToAddUser,
            openModalToAddUser,
            languageId,
            i18n
        } = this.props;

        const tabs = [];

        return (
            <main className={ `${style.users} full_width_sidebar` } id="page_with_sidebar">
                <section className={ style.page_with_sidebar_container } id="page_with_sidebar_container">
                    <button className={ 'action_button '} onClick={ openModalToAddUser }>+ {i18n.users_add_user}</button>
                    <Listview
                        entities={ users }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'desc' }
                        i18n={i18n}
                        translationKey={ 'users_' }
                    />
                </section>
                <Sidebar tabs={ tabs } />
                <aside className={ `${style.modal_container} hidden` } id="modal_add_account">
                    <Form
                        formId={ 'addAccount' }
                        sectionId={ 'account' }
                        method={ FormMethod.CREATE_SECTION }
                        hiddenFields={[]}
                        headerText={i18n.users_add_user}
                        submitButtonText={i18n.users_send_invite}
                        translationKeysOverride={{
                            firstName: {
                                placeholder: 'form_account_first_name_placeholder'
                            },
                            lastName: {
                                placeholder: 'form_account_last_name_placeholder'
                            },
                            infix: {
                                placeholder: 'form_account_infix_placeholder'
                            },
                            displayName: {
                                placeholder: 'form_account_display_name_placeholder'
                            },
                            email: {
                                placeholder: 'form_account_email_placeholder'
                            },
                            role: {
                                label: 'form_account_role_label'
                            }
                        }}
                        afterSubmit = { () => {
                            refreshDataWithMessage(i18n.users_add_user_success);
                        }}
                        closeModal={ closeModalToAddUser }
                        languageId={ languageId }
                    />
                </aside>
            </main>
        );
    }
}
