// the presentational component is concerned with the actual layout. has its own css, and its own component methods

import { h, Component } from 'preact';
/** @jsx h */

import ExampleItem from './components/ExampleItem/ExampleItem';
import showCurrentTime from '../../../../utils/showCurrentTime.js';
import style from './style/example.scss';

export default class Example extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items, addRandomItem } = this.props;

        // you can wrap this in a const or a condition if required
        const exampleItem = <ExampleItem
            items={ items }
            addRandomItem={ addRandomItem }
        />;

        let someDate = showCurrentTime();

        return (
            <section className={ style.example }>
                <span>{ someDate }</span>
                <section>
                    { exampleItem }
                </section>
            </section>
        )
    }
}
