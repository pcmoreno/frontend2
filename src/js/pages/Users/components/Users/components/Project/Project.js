import { h, Component } from 'preact';
import style from './style/project.scss';

/** @jsx h */

export default class Project extends Component {
    render() {
        return (
            <span className={ style.project }>
                project
            </span>
        );
    }
}
