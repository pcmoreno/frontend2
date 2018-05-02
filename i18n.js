import I18n from 'react-native-i18n';

import nl_NL from './data/i18n/tasks-nl_NL.js'
import en_GB from './data/i18n/tasks-en_GB.js'

I18n.fallbacks = true;

I18n.translations = {
    nl_NL,
    en_GB
};

export default I18n;