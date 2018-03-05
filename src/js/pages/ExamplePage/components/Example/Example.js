// the presentational component is concerned with the actual layout. has its own css, and its own component methods

import { h, Component } from 'preact';
/** @jsx h */

import Form from './../../../../components/Form';
import ExampleItem from './components/ExampleItem/ExampleItem';
import showCurrentTime from '../../../../utils/showCurrentTime.js';
import style from './style/example.scss';

export default class Example extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items, addItem, getItems } = this.props;

        // you can wrap this in a const or a condition if required
        const exampleItem = <ExampleItem
            items={ items }
            addItem={ addItem }
            getItems={ getItems }
        />;

        let someDate = showCurrentTime();

        return (
            <section className={ style.example }>
                <div className={ style.bar } id = "spinner" />
                You may wonder why this ExamplePage is still here. It serves as an example during refactoring of the Frontend. And also as a tutorial, since it has the structure and patterns the new frontend should follow.
                <span>{ someDate }</span>
                <section>
                    { exampleItem }
                </section>
                <section>
                    <Form
                        formId={ "organisation" }
                        ignoredFields={ [
                            "created",
                            "updated",
                            "manyOrganisationToManyCompetency",
                            "manyOrganisationToManyProduct",
                            "manyOrganisationToOneOrganisation",
                            "updated",
                            "updated"
                        ] }
                        forms = { this.props.forms }
                        storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ this.props.changeFormFieldValueForFormId }
                        baseUrl = { this.props.baseUrl }
                        afterSubmit = { this.props.getItems }
                    />
                </section>
                <section>
                    <Form
                        formId={ "project" }
                        ignoredFields={ [
                            "created",
                            "updated",
                            "manyProjectToOneOrganisation",
                            "manyProjectToOneProduct",
                            "manyProjectToManyCompetency",
                            "updated",
                            "updated"
                        ] }
                        forms = { this.props.forms }
                        storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId = { this.props.changeFormFieldValueForFormId }
                        baseUrl = { this.props.baseUrl }
                        afterSubmit = { this.props.getItems }
                    />
                </section>
            </section>
        )
    }
}
