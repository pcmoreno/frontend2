import { h, Component } from 'preact';
import style from './style/tabbedcomponent.scss';

/** @jsx h */

export default class TabbedComponent extends Component {
    constructor(props) {
        super(props);

        // you can optionally provide a default tab over props (you can also just leave out the 'hidden' class on one of your tab components)
        this.localState = {
            activeTab: this.props.activeTab
        };
    }

    switchTab(id) {
        this.localState.activeTab = id;
        this.setState(this.localState);
    }

    hideTabs() {

        // for the id of the tab, the tabbedComponent looks at the id provided by props. the id's on provided tab components
        // are only used by queryselector. this 'duplication' is to prevent issues extracting id's from a nested tab component.
        this.props.children.forEach(child => {
            const element = document.querySelector(`#${child.attributes.id}`);

            if (!element.classList.contains('hidden')) {
                element.classList.add('hidden');
            }
        });
    }

    componentDidUpdate() {
        const activeElement = document.querySelector(`#${this.localState.activeTab}`);

        if (activeElement && activeElement.classList.contains('hidden')) {

            this.hideTabs();

            activeElement.classList.remove('hidden');
        }
    }

    render() {
        const { i18n } = this.props;

        const nav = [];

        // built up navigation for tabs based on id's of the given tabs. note the i18n label is based on that id, too.
        this.props.children.forEach(child => {
            nav.push(
                <span role="button" tabIndex="1" onClick={() => {
                    this.switchTab(child.attributes.id);
                }}>{ i18n[child.attributes.id] }
                </span>
            );
        });

        return (
            <section className={ style.tabs }>
                <nav>{ nav }</nav>
                { this.props.children }
            </section>
        );
    }
}
