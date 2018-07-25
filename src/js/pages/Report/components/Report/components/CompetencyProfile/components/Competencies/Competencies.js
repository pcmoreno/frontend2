import { h, Component } from 'preact';
import Competency from './components/Competency/Competency';

/** @jsx h */

export default class Competencies extends Component {

    render() {

        // const { i18n } = this.props;

        // todo: we must check here if some of the required data is available, if nothing: do not render this component

        return (
            <section>

                { /* todo: add some Competencies widgets here */ }
                <Competency/>
                <Competency/>

            </section>
        );
    }
}
