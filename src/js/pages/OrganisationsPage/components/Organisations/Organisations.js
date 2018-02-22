import { h, Component } from 'preact';
/** @jsx h */

import Panels from './components/Panels/Panels';
import Detailpanel from './components/Detailpanel/Detailpanel';
import Form from './../../../../components/Form';
import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);
    }

    /* todo: holy crap. I have deleted the logic to send forth the form component include etc. take it from repo please */

    render() {
        let { items } = this.props;
        let panels = <Panels items={ items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />;

        return (
            <div className={ style.organisations }>
                <section className={ style.path }>
                    <p>path path path path gas oes here > path goes here > path goes here path path path path goes here > path goes here > path goes here path path path path goes here > path goes here > path goes here</p>
                </section>
                <section className={ style.panels_container }>
                    { panels }
                    <Detailpanel />
                </section>
                <section className={ style.background } >
                    <Form
                        formId={ "organisation" }
                        ignoredFields={ [
                            "created",
                            "updated",
                            "manyOrganisationToManyCompetency",
                            "manyOrganisationToManyProduct",
                            "manyOrganisationToOneOrganisation",
                            "updated",
                            "updated",
                            "organisationType",
                            "organisationSlug"
                        ] }
                        forms = { this.props.forms }
                        storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ this.props.changeFormFieldValueForFormId }
                        baseUrl = { this.props.baseUrl }
                        afterSubmit = { this.props.getItems }
                        active={ this.props.modalToAddOrganisation }
                        closeModal={ this.props.closeModalToAddOrganisation }
                    />
                </section>
            </div>
        )
    }
}
