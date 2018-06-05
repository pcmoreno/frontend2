import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/panelheader.scss';

export default class PanelHeader extends Component {
    constructor(props) {
        super(props);

        /**
         * Example of addConfigs
         * @example
         * {
         *    panelIndex: 1, // index or null
         *    parentType: null, // null or entity (string)
         *    addable: [
         *        {
         *            type: 'organisation', // entity (string)
         *            icon: null, // null or FA icon (string)
         *            openMethod: this.openModalToAddOrganisation // method
         *        }
         *    ]
         * }
         */
        this.localState = {
            showAddDropDown: false,
            currentAddConfig: {},
            addConfigs: [
                {
                    panelIndex: 1, // counting starts at 1
                    parentType: null,
                    addable: [
                        {
                            type: 'organisation',
                            icon: null,
                            text: this.props.i18n.organisations_organisation
                        }
                    ]
                },
                {
                    panelIndex: null,
                    parentType: 'organisation',
                    addable: [
                        {
                            type: 'project',
                            icon: 'clipboard-list',
                            text: this.props.i18n.organisations_project
                        },
                        {
                            type: 'jobFunction',
                            icon: 'suitcase',
                            text: this.props.i18n.organisations_job_function
                        }
                    ]
                },
                {
                    panelIndex: null,
                    parentType: 'jobFunction',
                    addable: [
                        {
                            type: 'project',
                            icon: 'clipboard-list',
                            text: this.props.i18n.organisations_project
                        }
                    ]
                }
            ]
        };

        this.hideAddInput = this.hideAddInput.bind(this);
    }

    hideAddInput() {
        this.localState.showAddDropDown = false;
        this.setState(this.localState);

        window.removeEventListener('click', this.hideAddInput, true);
    }

    showAddInput() {
        const addMethods = this.props.addMethods;

        // validate the props
        if (!addMethods) {
            return;
        }

        // extract methods
        const addConfig = this.localState.currentAddConfig.addable;

        // show a list of items when there are multiple entities possible to add
        if (addConfig.length === 1) {

            // there is only one input type, so we can call the show method directly
            addMethods[addConfig[0].type]();

        } else if (addConfig.length > 1) {

            // update the state to show the dropdown
            this.localState.showAddDropDown = true;
            this.setState(this.localState);

            // add event listener to be able to close the dropdown
            window.addEventListener('click', this.hideAddInput, true);
        }
    }

    render() {
        const { i18n, addMethods, panelId, parentType } = this.props;
        const addDropdown = [];
        let addConfig = null;

        for (let i = 0; i < this.localState.addConfigs.length; i++) {
            const config = this.localState.addConfigs[i];

            // match the allowed addable entities based on parentType or panel id/index (hardcoded)
            if (config.parentType === parentType || config.panelIndex === panelId) {
                addConfig = config;
                this.localState.currentAddConfig = config;
                break;
            }
        }

        const showAddButton = !!(addConfig && addMethods);

        // set the addable methods to the dropdown
        if (addConfig.addable.length > 1) {
            addConfig.addable.forEach(addOption => {
                addDropdown.push(
                    <li>
                        <div tabIndex='0' role='button' onClick={ addMethods[addOption.type] } className={ style.actionItem }>
                            <div className={ style.icon }>
                                <FontAwesomeIcon icon={ addOption.icon } />
                            </div>
                            { addOption.text }
                        </div>
                    </li>
                );
            });
        }

        return (
            <nav className={ style.header }>
                <div className={ style.addContainer }>
                    {
                        showAddButton &&
                        <button onClick={ this.showAddInput.bind(this) }>{i18n.organisations_add}</button>
                    }
                    <ul className={ `${style.actionList} ${this.localState.showAddDropDown ? '' : 'hidden'}` }>
                        { addDropdown }
                    </ul>
                </div>
            </nav>
        );
    }
}
