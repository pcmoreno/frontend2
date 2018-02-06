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
                <div className={ style.bar } id = "fetching-data-indicator" />
                <span>{ someDate }</span>
                <section>
                    { exampleItem }
                </section>
                <section>
                    form 1:
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
                    />
                </section>
                <section>
                    form 2:
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
                    />
                </section>
            </section>
        )
    }
}
