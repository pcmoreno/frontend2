import { h, Component } from 'preact';

import ManyToMany from './components/Kind/ManyToMany';
import ManyToOne from './components/Kind/ManyToOne';
import OneToMany from './components/Kind/OneToMany';
import OneToOne from './components/Kind/OneToOne';

import * as relationship from './../../constants/Relationships';

export default class Relationship extends Component {
    render() {
        const { options, onChange, localState } = this.props;

        switch (options.kind) {
            case relationship.MANY_TO_MANY:
                return (<ManyToMany options={options} onChange={onChange} localState={localState} />);
            case relationship.ONE_TO_MANY:
                return (<OneToMany options={options} onChange={onChange} localState={localState} />);
            case relationship.MANY_TO_ONE:
                return (<ManyToOne options={options} onChange={onChange} localState={localState} />);
            case relationship.ONE_TO_ONE:
                return (<OneToOne options={options} onChange={onChange} localState={localState} />);
            default:
                return null;
        }
    }
}
