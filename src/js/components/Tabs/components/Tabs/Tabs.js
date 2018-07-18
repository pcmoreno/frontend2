import { h, Component } from 'preact';
import style from './style/tabs.scss';

/** @jsx h */

/**
 * Tabs component
 * Creates tabs rendered as an aside that uses composition to render the provided children
 * Note that child component should always have a label and an id.
 *
 * @example
 * <Tabs activeTab="some-id">
 *     <SomeComponent
 *         id={ 'some-id' }
 *         label={ 'label to show as tab link' }
 *      />
 * </Tabs>
 *
 * @param {string} activeTab - id of the tab to render as default
 * @returns {Tabs} Tabs
 */
export default class Tabs extends Component {
    constructor(props) {
        super(props);

        // you can provide the default tab over props
        this.localState = {
            activeTab: null
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

                // remove the 'active' from the tablink (see below)
                if (document.querySelector(`#tablink_${child.attributes.id}`)) {
                    document.querySelector(`#tablink_${child.attributes.id}`).classList.remove('active');
                }
            }
        });
    }

    updateTabs() {
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

    componentDidUpdate() {
        if (this.props.activeTab !== null) {

            // default to given tab
            this.localState.activeTab = this.props.activeTab;
        }

        this.updateTabs();
    }

    componentDidMount() {

        if (this.props.activeTab) {

            // default to given tab
            this.localState.activeTab = this.props.activeTab;
        } else {

            // default to first child id
            if (this.props.children) {
                this.localState.activeTab = this.props.children[0].attributes.id;
            }
        }

        this.updateTabs();
    }

    render() {
        const tabLinks = [];

        // built up navigation for tabs based on id's of the given tabs
        this.props.children.forEach((child, index) => {

            // check the required attributes before proceeding
            if (!child.attributes.id || !child.attributes.label) {
                throw new Error('Tabs: Child elements should always have a label and id');
            }

            tabLinks.push(
                <span
                    role="button"
                    tabIndex={ index }
                    onClick={() => {
                        this.switchTab(child.attributes.id);
                    }}
                    id={ `tablink_${child.attributes.id}` }
                >{child.attributes.label}</span>
            );
        });

        return (
            <section className={ `${style.tabs} tabs` }>
                <nav>{ tabLinks }</nav>
                { this.props.children }
            </section>
        );
    }
}
