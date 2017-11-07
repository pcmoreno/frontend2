//import React from 'react';
import { h, Component } from 'preact';
/** @jsx h */
import Task from './js/Task/Task';
import css from './css/tasks.scss';

export default class Tasks extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <section className="clear tasks">
                <section>
                    <Task />
                </section>
            </section>
        )
    }
}
