import { h, Component } from 'preact';

import ManyToMany from './components/Kind/ManyToMany';
import ManyToOne from './components/Kind/ManyToOne';
import OneToMany from './components/Kind/OneToMany';
import OneToOne from './components/Kind/OneToOne';

import * as relationship from './../../constants/Relationships';

export default class Relationship extends Component {
    render() {
        const { options, onChange, value, currentForm, formId } = this.props;

        switch (options.kind) {
            case relationship.MANY_TO_MANY:
                return (<ManyToMany options={options} onChange={onChange} currentForm={currentForm} value={ value } formId={ formId } />);
            case relationship.ONE_TO_MANY:
                return (<OneToMany options={options} onChange={onChange} currentForm={currentForm} value={ value } formId={ formId } />);
            case relationship.MANY_TO_ONE:
                return (<ManyToOne options={options} onChange={onChange} currentForm={currentForm} value={ value } formId={ formId } />);
            case relationship.ONE_TO_ONE:
                return (<OneToOne options={options} onChange={onChange} currentForm={currentForm} value={ value } formId={ formId } />);
            default:
                return null;
        }
    }
}
