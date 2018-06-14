import { h, Component } from 'preact';

import ManyToMany from './components/Kind/ManyToMany';
import ManyToOne from './components/Kind/ManyToOne';
import OneToMany from './components/Kind/OneToMany';
import OneToOne from './components/Kind/OneToOne';

import * as relationship from './../../constants/Relationships';

export default class Relationship extends Component {
    render() {
        const { options, handle, label, onChange, value, currentForm, formId, i18n } = this.props;

        // note that since component re-renders on submit (because state changes), the extraction of .value from the
        // consultant object has already taken place, thus if it .uuid cant be extracted, it will default to value

        switch (options.kind) {
            case relationship.MANY_TO_MANY:
                return (<ManyToMany
                    options={options}
                    handle={handle}
                    label={label}
                    onChange={onChange}
                    currentForm={currentForm}
                    value={ value }
                    formId={ formId }
                    i18n={ i18n }
                    selectedValue={ value.uuid || value }
                />);
            case relationship.ONE_TO_MANY:
                return (<OneToMany
                    options={options}
                    handle={handle}
                    label={label}
                    onChange={onChange}
                    currentForm={currentForm}
                    value={ value }
                    formId={ formId }
                    i18n={ i18n }
                    selectedValue={ value.uuid || value }
                />);
            case relationship.MANY_TO_ONE:
                return (<ManyToOne
                    options={options}
                    handle={handle}
                    label={label}
                    onChange={onChange}
                    currentForm={currentForm}
                    value={ value }
                    formId={ formId }
                    i18n={ i18n }
                    selectedValue={ value.uuid || value }
                />);
            case relationship.ONE_TO_ONE:
                return (<OneToOne
                    options={options}
                    handle={handle}
                    label={label}
                    onChange={onChange}
                    currentForm={currentForm}
                    value={ value }
                    formId={ formId }
                    i18n={ i18n }
                    selectedValue={ value.uuid || value }
                />);
            default:
                return null;
        }
    }
}
