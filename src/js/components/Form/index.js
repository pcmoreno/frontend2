import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as formActions from './actions/form'

import Form from './components/Form/Form'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        // binds dispatch with action creators so dispatch or store does not need to be passed down to child components
        this.actions = bindActionCreators(
            Object.assign({}, formActions),
            dispatch
        );
    }

    componentDidMount() {
        this.getFormFields(this.props.formId);
    }

    getFormFields(formId) {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/'+formId;
        document.getElementById('fetching-data-indicator').classList.add('visible');
        document.getElementById('fetching-data-indicator').classList.remove('visible');

        fetch(url, {
            method: "options",
            mode: "cors"
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                response.json().then((response) => {
                    this.actions.getFormFields(response.fields);
                }).catch(error => {
                    return Promise.reject(console.log('JSON error: ' + error.message));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('Endpoint error: '));
            }
            return Promise.reject(console.log('HTTP error: ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('URL error: ' + error.message));
        });
    }

    render() {
        return (<Form
            ignoredFields={ this.props.ignoredFields }
            formFields={ this.props.formFields }
        />)
    }
}

const mapStateToProps = (state) => {
    return {
        formFields: state.formReducer.formFields
    }
};

export default connect(mapStateToProps)(Index);
