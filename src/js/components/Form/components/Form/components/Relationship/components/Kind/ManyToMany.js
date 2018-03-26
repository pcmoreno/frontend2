import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';

export default class ManyToMany extends Component {

    createOptions(options) {
        return options.map(option => {
            return (<Option value={option.name} optionValue={option.slug} />);
        });
    }

    render() {
        const { options, onChange } = this.props;

        // OK, Right now it's posted like this: form[childOrganisations] = some-slug
        // It should be form[childOrganisations][] = some-slug
        return (
            <div>
                <label htmlFor={ options.handle }>{ options.form.all.label }</label>
                <span className={ `${style.errorMessage}` }>Errors</span>
                <select
                    id={ options.handle }
                    name={ options.handle }
                    required="required"
                    multiple="multiple"
                    onChange={ onChange }
                >
                    { this.createOptions(options[options.to]) }
                </select>
            </div>
        );
    }
}
