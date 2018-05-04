import { h, Component } from 'preact';

import ManyToMany from './components/Kind/ManyToMany';
import ManyToOne from './components/Kind/ManyToOne';
import OneToMany from './components/Kind/OneToMany';
import OneToOne from './components/Kind/OneToOne';

export const MANY_TO_MANY = 'many-to-many';
export const ONE_TO_MANY = 'one-to-many';
export const MANY_TO_ONE = 'many-to-one';
export const ONE_TO_ONE = 'one-to-one';

export default class Relationship extends Component {
    render() {
        const { options, onChange, localState } = this.props;

        switch (options.kind) {
            case MANY_TO_MANY:
                return (<ManyToMany options={options} onChange={onChange} localState={localState} />);
            case ONE_TO_MANY:
                return (<OneToMany options={options} onChange={onChange} localState={localState} />);
            case MANY_TO_ONE:
                return (<ManyToOne options={options} onChange={onChange} localState={localState} />);
            case ONE_TO_ONE:
                return (<OneToOne options={options} onChange={onChange} localState={localState} />);
            default:
                return null;
        }
    }
}
