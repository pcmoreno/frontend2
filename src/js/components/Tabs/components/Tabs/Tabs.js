import { h, Component } from 'preact';
import style from './style/tabs.scss';

/** @jsx h */

/**
 * Tabs component
 * Creates tabs rendered as an aside that uses composition to render the provided children
 *
 * @example
 * <Tabs i18n={ i18n } activeTab="organisations_edit_global_competencies">
 * <SomeComponent id={ 'some-id' } label={ 'label to show as tab link' }/></Tabs>
 *
 * @param {Object} i18n - i18n object
 * @param {string} activeTab - id of the tab to render as default
 * @param {string} id - used to render the subnavigation links
 * @param {string} label - used to render the subnavigation links
 * @returns {*} Tabs
 */
export default class Tabs extends Component {
    constructor(props) {
        super(props);

        // you can provide the default tab over props
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
        this.updateTabs();
    }

    componentDidMount() {
        this.updateTabs();
    }

    render() {
        const { i18n } = this.props;
        const tabLinks = [];

        // built up navigation for tabs based on id's of the given tabs
        this.props.children.forEach((child, index) => {
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
        });

        return (
            <section className={ `${style.tabs} tabs` }>
                <nav>{ tabLinks }</nav>
                { this.props.children }
            </section>
        );
    }
}
