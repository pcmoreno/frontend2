import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Error from './components/Error/Error';
import translator from '../../utils/translator';

/** @jsx h */

class Index extends Component {
    componentDidMount() {
        updateNavigationArrow();
    }

    render() {

        // ensure i18n is updated when the languageId changes
        this.i18n = translator(this.props.languageId, ['error']);
        document.title = this.i18n.error_page_not_found;

        return (
            <Error
                i18n={ this.i18n }
            />
        );
    }
}

const mapStateToProps = state => ({
    languageId: state.headerReducer.languageId
});


export default connect(mapStateToProps)(Index);
