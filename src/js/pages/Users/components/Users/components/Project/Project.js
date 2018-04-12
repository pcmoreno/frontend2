import { h, Component } from 'preact';

/** @jsx h */

import style from './style/project.scss';

export default class Project extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <span className={ style.project }>
                project
            </span>
        );
    }
}
