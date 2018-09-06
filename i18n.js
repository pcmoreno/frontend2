import I18n from 'react-native-i18n';

import nl_NL from './data/i18n/inbox-nl_NL.js'
import en_GB from './data/i18n/inbox-en_GB.js'

I18n.fallbacks = true;

I18n.translations = {
    nl_NL,
    en_GB
};

export default I18n;