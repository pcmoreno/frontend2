import { h, Component } from 'preact';
import style from './style/tabbedcomponent.scss';

/** @jsx h */

export default class TabbedComponent extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            activeTab: this.props.activeTab
        };
    }

    hideTabs() {
        this.props.children[0].children.forEach(child => {
            const element = document.querySelector(`#${child.attributes.id}`);

            if (!element.classList.contains('hidden')) {
                element.classList.add('hidden');
            }
        });
    }

    componentDidUpdate() {
        if (this.localState.activeTab !== this.props.activeTab) {

            this.hideTabs();

            const activeElement = document.querySelector(`#${this.props.activeTab}`);

            if (activeElement.classList.contains('hidden')) {
                activeElement.classList.remove('hidden');

                this.localState.activeTab = this.props.activeTab;
                this.setState(this.localState);
            }
        }
    }

    render() {
        return (
            <section className={ style.tabs }>
                { this.props.children }
            </section>
        );
    }
}
