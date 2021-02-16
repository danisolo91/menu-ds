const MenuDS = (() => {
    const menuNav = document.getElementById('menu-ds');
    const horizontalUl = menuNav.lastElementChild;

    const refreshEvents = () => {
        /* 
        ** Add 'mouseenter' events to the horizontal 'li' elements 
        ** that have a dropdown menu inside
        */
        Array.from(horizontalUl.children).forEach(horizontalLi => {
            const verticalUl = horizontalLi.getElementsByTagName('ul');

            if(verticalUl.length > 0) {
                verticalUl[0].classList.add('absolute');

                horizontalLi.addEventListener('mouseenter', e => {
                    e.preventDefault();
                    Array.from(verticalUl[0].children).forEach(li => {
                        li.classList.add('visible');
                    });
                });

                /* 
                ** Add 'click' events to the vertical 'li' elements 
                ** that have a dropdown menu inside
                */
                Array.from(verticalUl[0].getElementsByTagName('li')).forEach(verticalLi => {
                    const verticalUlDropdown = verticalLi.getElementsByTagName('ul');

                    if(verticalUlDropdown.length > 0) {
                        const aElement = verticalLi.getElementsByTagName('a')[0];
                        aElement.addEventListener('click', e => {
                            e.preventDefault();
                            Array.from(verticalUlDropdown[0].children).forEach(li => {
                                li.classList.toggle('visible');
                            });
                        });
                    }
                });

                /*
                ** Remove 'visible' classes from horizontal and vertical
                ** dropdown menus when 'mouseleave' the horizontal Li
                */
                horizontalLi.addEventListener('mouseleave', e => {
                    e.preventDefault();
                    Array.from(verticalUl[0].children).forEach(li => {
                        li.classList.remove('visible');
                    });

                    // Also remove 'visible' from the verticalUlDropdown
                    Array.from(verticalUl[0].getElementsByTagName('li')).forEach(verticalLi => {
                        const verticalUlDropdown = verticalLi.getElementsByTagName('ul');

                        if(verticalUlDropdown.length > 0) {
                            Array.from(verticalUlDropdown[0].children).forEach(li => {
                                li.classList.remove('visible');
                            });
                        }
                    });
                });
            }
        });
    };

    const refreshResponsive = () => {
        let eventsRefresh = false;
        let buttonNotAppended = false;
        let appendButton = false;
        let moreButton = document.getElementById('more-button-ds');

        if(moreButton === null) {
            moreButton = createMoreButton();
            buttonNotAppended = true;
            eventsRefresh = true;
        }

        const moreBtnUl = moreButton.getElementsByTagName('ul')[0];

        let navWidth = menuNav.offsetWidth;
        let totalLiWidth = 0;

        Array.from(horizontalUl.children).forEach(li => {
            totalLiWidth += li.offsetWidth;
        });

        /*
        ** If there is not enough space to show the last horizontal
        ** element, append it to the 'more' dropdown.
        */ 
        if(totalLiWidth > navWidth) {
            if(horizontalUl.lastElementChild.id === moreButton.id) {
                moreBtnUl.appendChild(horizontalUl.lastElementChild.previousElementSibling);
            } else {
                moreBtnUl.appendChild(horizontalUl.lastElementChild);
            }
            eventsRefresh = true;
            if(buttonNotAppended === true) appendButton = true;
        } else {
            /* 
            ** Pull out the last element from the 'more' dropdown if there 
            ** is enough space in the horizontal menu.
            */
            if(buttonNotAppended === false) {
                let pullOut = false;
                const btnLastElement = moreBtnUl.lastElementChild;
                const clone = btnLastElement.cloneNode( true );
                
                // temporary clone to get the offsetWidth of display:none element
                horizontalUl.appendChild(clone);

                if(moreBtnUl.children.length > 1) {
                    if(clone.offsetWidth + totalLiWidth < navWidth) {
                        pullOut = true;
                    }
                } else if(moreBtnUl.children.length === 1) {
                    if(clone.offsetWidth + totalLiWidth - moreBtn.offsetWidth < navWidth) {
                        pullOut = true;
                    }
                }

                horizontalUl.removeChild(clone);

                if(pullOut === true) {
                    horizontalUl.insertBefore(
                        btnLastElement, 
                        horizontalUl.lastElementChild
                    );
                }

                if(moreBtnUl.children.length === 0) {
                    horizontalUl.removeChild(moreBtn);
                }
            }
        }

        /*
        ** Append the button to the menu if it's not and has 
        ** elements inside.
        ** Also insert the last horizontal LI as firstChild into
        ** the 'more' dropdown to make space to show the button.
        */
        if(buttonNotAppended === true && appendButton === true) {
            moreBtnUl.insertBefore(
                horizontalUl.lastElementChild, 
                moreBtnUl.firstChild
            );
            horizontalUl.appendChild(moreButton);
        }

        if(eventsRefresh === true) refreshEvents();
    };

    const createMoreButton = () => {
        const moreBtn = document.createElement('li');
        moreBtn.id = 'more-button-ds';
        moreBtn.innerHTML = `<a href="#">More</a><ul class="dropdown"></ul>`;

        return moreBtn;
    };

    const init = () => {
        refreshResponsive();

        /*
        ** Check with 'resize' event if there is enough space
        ** to show horizontal LI elements.
        */
        window.addEventListener('resize', e => {
            refreshResponsive();
        });
    };

    return { init }
})();

MenuDS.init();