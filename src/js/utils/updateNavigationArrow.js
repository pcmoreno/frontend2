/**
 * Highlights the active navigation node and updates the indicator arrow underneath it accordingly
 *
 * note that an attempt was made to include this in the root component (App.js) but there were conflicts with preact's
 * lifecycle: at some point (during refresh) the navigation nodes were not (re)rendered yet thus their positions couldnt
 * be parsed resulting in an incorrectly positioned indicator arrow. by calling this function from componentDidUpdate
 * instead this problem seems to have been solved. feel free to attempt a different approach though!
 */
export default function updateNavigationArrow() {

    // remove all '.active' classes
    const items = document.querySelectorAll('body header > nav > ul li');

    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }

    // add active class to the current navigation node
    const path = (window.location.pathname).replace(new RegExp('/', 'g'), '').toLowerCase();
    const activeItem = document.querySelector('body header ul > li#' + path);

    // move the indicator out of view (in case of unexpected path not matching a navigation node)
    document.querySelector('#indicator svg').style.left = '-10000px';

    if (activeItem !== 'undefined') {
        activeItem.classList.add('active');

        // move indicator arrow to the middle of the active navigation node
        const activeItemBox = activeItem.getBoundingClientRect();
        const activeItemMiddle = activeItemBox.left + ((activeItemBox.right - activeItemBox.left) / 2);

        document.querySelector('#indicator svg').style.left = (activeItemMiddle - 12) + 'px';
    }
}
