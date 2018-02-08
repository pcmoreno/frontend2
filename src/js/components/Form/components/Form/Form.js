import { h, Component } from 'preact';
/** @jsx h */

import DateTimeField from './components/DateTimeField/DateTimeField';
import Relationship from './components/Relationship/Relationship';
import TextInput from './components/TextInput/TextInput';
import Slug from './components/Slug/Slug';
import Choice from './components/Choice/Choice';
import style from './style/form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    buildInputType(name, type, handle, label, formFieldOptions = null) {
        // todo: implement all from https://github.com/dionsnoeijen/sexy-field-field-types-base/tree/master/src/FieldType
        switch (type) {
            case 'DateTimeField':
                return (<DateTimeField name={ name } handle={ handle} label={ label } onChange={this.handleChange} />);
            case 'Relationship':
                return (<Relationship name={ name } handle={ handle} label={ label } onChange={this.handleChange} />);
            case 'TextInput':
                return (<TextInput name={ name } handle={ handle} label={ label } onChange={this.handleChange} />);
            case 'Slug':
                return (<Slug name={ name } handle={ handle} label={ label } onChange={this.handleChange} />);
            case 'Choice':
                return (<Choice name={ name } handle={ handle} formFieldOptions={ formFieldOptions } label={ label } onChange={this.handleChange} />);
            default:
                console.log('input type unknown!');
        }
    }

    ajaxPost(url = 'http://dev.ltponline.com:8001/api/v1/section/organisation', data) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('POST', url);
            let formData = data;
            if (!(formData instanceof FormData)) {
                formData = new FormData();
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, data[key]);
                    }
                }
            }
            req.onload = () =>
                req.status === 200 ?
                    resolve(req.response) :
                    reject(Error(req.statusText));
            req.onerror = (e) => reject(Error(`Network Error: ${e}`));
            req.send(formData);
        });
    }

    postFormuliertje(formData) {

        console.log(formData.values());

        const bla = Object.keys(formData).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
        }).join('&');

        console.log(bla)

        let url = 'http://dev.ltponline.com:8001/api/v1/section/organisation';
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: bla
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    // no need to trigger a new action (unless we want ghosting) so instead fetch new items:
                    this.getItems();
                }).catch(error => {
                    return Promise.reject(console.log('JSON error - ' + error));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('API not available'));
            }
            return Promise.reject(console.log('HTTP error - ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('No such route exists - ' + error));
        });
    }

    handleChange(event) {
        // prevent defaults and call the container method
        event.preventDefault();

    }

    handleSubmit(event) {
        // prevent defaults and call the container method
        event.preventDefault();
        // this.props.submitForm(event);

        let formData = new FormData(event.currentTarget);
        this.ajaxPost(formData);
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        let { forms, ignoredFields, formId } = this.props;
        let formOutput = 'loading form';

        if (forms && forms.length > 0){
            // loop through them to find the one that matches formId
            forms.map(form => {
                if (form.id === formId) {
                    formOutput = form.formFields.map(formField => {
                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {
                            // only work with non-ignored fields
                            let name = Object.keys(formField);
                            let type = formField[name].type;
                            let handle = formField[name].handle;

                            // todo: ensure this also handles amending forms, something like this:
                            // if (create) {
                            //     if (isset form.create.label) {
                            //         label = form.create.label;
                            //     }
                            // } else {
                            //     if (isset form.edit.label) {
                            //         label = form.edit.label;
                            //     }
                            // }
                            // if (label === null) {
                            //     label = form.all.label;
                            // }

                            let label = formField[name].form.create ? formField[name].form.create.label : formField[name].form.all.label;
                            let formFieldOptions = formField[name].form.all;
                            return this.buildInputType(name, type, handle, label, formFieldOptions);
                        }
                    });
                }
            })
        }

        return (<section className={ style.background }><section className={ style.form }><form onSubmit={ this.handleSubmit } id={formId}>
            { formOutput }
            <input type="submit" value="Submit" />
        </form></section></section>)
    }
}
