import { h, Component } from 'preact';

/** @jsx h */

import TabbedModal from './components/TabbedModal/TabbedModal';

export default class Index extends Component {
    render() {
        return (<TabbedModal
            closeModalToEditCompetences={ this.props.closeModalToEditCompetences }
            i18n={ this.props.i18n }
            languageId={ this.props.languageId }
        />);
    }
}
