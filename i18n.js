import I18n from 'react-native-i18n';

import en_GB from './data/i18/report-en_GB.js'
import nl_NL from './data/i18n/report-nl_NL.js'

I18n.fallbacks = true;

I18n.translations = {
    nl_NL,
    en_GB
};

export default I18n;