// the presentational component is concerned with the actual layout. has its own css, and its own component methods

import { h, Component } from 'preact';

/** @jsx h */

import style from './style/exampleitem.scss';

export default class ExampleItem extends Component {
    constructor(props) {
        super(props);

        // define a local state (to keep track of something in the GUI, for example)
        this.localState = {
            active: false
        };
    }

    // lifecycle methods go here
    componentDidMount() {
    }

    render() {
        let { items, addItem, getItems } = this.props;

        // style was passed on as a prop to be able to use a custom selector defined in it. alternatively it could have
        // been imported again (file size won't increase) but.. it would be best to give this component its own css file

        // since setState was used to update this var, the component re-renders and thus the localState is toggled
        let activeText;

        if (this.localState.active) {
            activeText = 'active';
        } else {
            activeText = '';
        }

        let itemList = [];

        if (items && items.length > 0) {
            items.forEach(item => {
                itemList.push(<li>{ item.organisationName }</li>);
            });
        }

        return (

            // keep in mind, normally you'd extract this into a button and a list component, and perhaps even a listItem
            <section>
                <p>
                    <button onClick={ getItems } type="button">Get items</button>
                    This retrieves Organisation entities via the Sexy Field API
                </p>
                <br />
                <br />
                <p>
                    <button onClick={ addItem } type="button">Add real item +</button>
                    This adds a randomly named Organisation entity via the Sexy Field API, then retrieves all items again
                </p>
                <br />
                <br />
                <span
                    role="link"
                    tabIndex="0"
                    onClick={ () => this.setState(this.localState.active = !this.localState.active === true) }
                    className={ style.someFilter }
                >
                    toggle 'someFilter'
                </span>{ activeText }
                <ul id="project-list">
                    { itemList }
                </ul>
            </section>
        );
    }
}
