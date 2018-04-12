import { h, Component } from 'preact';

/** @jsx h */

import Indicator from './components/Indicator/Indicator';
import Tab from './components/Tab/Tab';
import Content from './components/Content/Content';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/sidebar.scss';

class Sidebar extends Component {
    constructor() {
        super();

        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        document.querySelector('#sidebar_indicator svg').style.left = '10000px';
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const activeItem = document.querySelector('#sidebar header nav section.active');

        if (activeItem) {
            const activeItemBox = activeItem.getBoundingClientRect();
            const activeItemMiddle = activeItemBox.left + ((activeItemBox.right - activeItemBox.left) / 2);
            const sideBar = document.querySelector('#sidebar');
            const sideBarBox = sideBar.getBoundingClientRect();

            // move indicator underneath the active tab
            document.querySelector('#sidebar_indicator svg').style.left = (activeItemMiddle - sideBarBox.left - 20) + 'px';
        }
    }

    toggleSidebar() {
        if (document.querySelector('#listview_with_sidebar').classList.contains('full_width_sidebar')) {
            document.querySelector('#listview_with_sidebar').classList.remove('full_width_sidebar');
        } else {
            document.querySelector('#listview_with_sidebar').classList.add('full_width_sidebar');
        }
    }

    render() {
        const { tabs } = this.props;

        const tabOutput = [];
        const contentOutput = [];
        let index = 1;

        if (tabs) {
            tabs.forEach(tab => {
                let active = false;

                // by default the first tab is active
                if (index === 1) {
                    active = true;
                }

                tabOutput.push(<Tab
                    tabId={ index }
                    name={ tab.name }
                    icon={ tab.icon }
                    isTabActive={ active }
                    updateDimensions={ this.updateDimensions }
                />);

                contentOutput.push(<Content
                    tabId={ index }
                    component={ tab.component }
                    isContentActive={ active }
                />);

                index++;
            });
        }

        return (<aside className={ `${style.sidebar}` } id="sidebar" >
            <header>
                <div
                    className={ style.toggle }
                    id="sidebar_toggle"
                    onClick={ this.toggleSidebar }
                    role="button"
                    tabIndex="0">
                    <FontAwesomeIcon icon={ 'chevron-right' } />
                </div>
                <nav>
                    { tabOutput }
                </nav>
            </header>
            <Indicator />
            <main>
                { contentOutput }
            </main>
        </aside>
        );
    }
}

export default Sidebar;