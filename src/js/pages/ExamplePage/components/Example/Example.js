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
        let { items, addItem, getItems, formFields } = this.props;

        // you can wrap this in a const or a condition if required
        const exampleItem = <ExampleItem
            items={ items }
            addItem={ addItem }
            getItems={ getItems }
        />;

        let someDate = showCurrentTime();

        return (
            <section className={ style.example }>
                <div className={ style.bar } id="fetching-data-indicator" />
                <span>{ someDate }</span>
                <section>
                    { exampleItem }
                </section>
                <section>
                    <Form
                        formId={ "organisation" }
                        formFields={ formFields }
                        ignoredFields={ ["created", "updated"] }
                    />
                </section>
            </section>
        )
    }
}
