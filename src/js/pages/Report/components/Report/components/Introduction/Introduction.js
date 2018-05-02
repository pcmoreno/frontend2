import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class Introduction extends Component {

    render() {
        const { texts } = this.props;

        // todo: translate title

        if (!texts) {
            return null;
        }

        return (
            <ReportSection title={'Introduction'}>
                <ReportColumn>
                    <TextBlock
                        field={texts.goal}
                        editable={true}
                    />
                    <TextBlock
                        field={texts.validity}
                        editable={true}
                    />
                </ReportColumn>
                <ReportColumn>
                    <TextBlock
                        field={texts.parts}
                        editable={true}
                    />
                    <TextBlock
                        field={texts.structure}
                        editable={true}
                    />
                </ReportColumn>
            </ReportSection>
        );
    }
}
