import { h, Component } from 'preact';
import style from './style/attachmentrow.scss';

/** @jsx h */

export default class AttachmentRow extends Component {
    render() {
        const { children, intro, intellectualCapabilities } = this.props;

        if (!children) {
            return null;
        }

        return (
            <div className={ `${style.attachmentrow} ${intro ? style.intro : ''} ${intellectualCapabilities ? style.intellectualCapabilities : ''}` }>
                { children }
            </div>
        );
    }
}
