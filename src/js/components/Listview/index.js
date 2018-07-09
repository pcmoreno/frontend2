import { h, Component } from 'preact';

/** @jsx h */

import { connect } from 'preact-redux';
import Listview from './components/Listview/Listview';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            entities,
            defaultSortingKey,
            defaultSortingOrder,
            translationKeyPrefix,
            alerts,
            i18n,
            selectedEntities,
            toggleSelectAll
        } = this.props;

        return (<Listview
            entities={ entities }
            selectedEntities={ selectedEntities }
            toggleSelectAll={ toggleSelectAll }
            defaultSortingKey={ defaultSortingKey }
            defaultSortingOrder={ defaultSortingOrder }
            translationKeyPrefix={ translationKeyPrefix }
            alerts={ alerts }
            i18n={ i18n }
        />);
    }
}
export default connect()(Index);
