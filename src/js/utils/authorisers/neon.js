import AbstractAuthoriser from './abstract';

/**
 * @class NeonAuthoriser
 * @description Performs all neon authorisation
 */
class NeonAuthoriser extends AbstractAuthoriser {

    constructor() {
        super('neon');
    }
}

export default NeonAuthoriser;
