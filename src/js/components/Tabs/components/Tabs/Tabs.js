import { h, Component } from 'preact';
import style from './style/tabs.scss';

/** @jsx h */

export default class Tabs extends Component {
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
            if (child !== null) {
                const element = document.querySelector(`#${child.attributes.id}`);

                if (!element.classList.contains('hidden')) {
                    element.classList.add('hidden');

                    // remove the 'active' from the tablink (see below)
                    if (document.querySelector(`#tablink_${child.attributes.id}`)) {
                        document.querySelector(`#tablink_${child.attributes.id}`).classList.remove('active');
                    }
                }
            }
        });
    }

    componentDidUpdate() {
        const activeElement = document.querySelector(`#${this.localState.activeTab}`);

        if (activeElement && activeElement.classList.contains('hidden')) {
            this.hideTabs();
            activeElement.classList.remove('hidden');

            // the .active class can be used to do tab label highlighting or determine which tab is active (to hide
            // other tabs, for example, as done on Organisations page)
            if (document.querySelector(`#tablink_${this.localState.activeTab}`)) {
                document.querySelector(`#tablink_${this.localState.activeTab}`).classList.add('active');
            }
        }
    }

    render() {
        const { i18n } = this.props;
        const tabLinks = [];

        // built up navigation for tabs based on id's of the given tabs
        this.props.children.forEach((child, index) => {
            if (child !== null) {
                tabLinks.push(
                    <span
                        role="button"
                        tabIndex={ index }
                        onClick={() => {
                            this.switchTab(child.attributes.id);
                        }}
                        id={ `tablink_${child.attributes.label}` }
                    >{i18n[child.attributes.label]}
                    </span>
                );
            }
        });

        return (
            <section className={ `${style.tabs} tabs` }>
                <nav>{ tabLinks }</nav>
                { this.props.children }
            </section>
        );
    }
}
