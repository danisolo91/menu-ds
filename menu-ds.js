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

                horizontalLi.getElementsByTagName('a')[0].removeEventListener(
                    'click',
                    handleClick
                );

                /*
                ** save verticalUl on horizontalLi's prototype to access it in 
                ** the handler function.
                */
                horizontalLi.verticalUl = verticalUl; 
                horizontalLi.addEventListener(
                    'mouseenter', 
                    handleMouseEnter
                );

                /* 
                ** Add 'click' events to the vertical 'li' elements 
                ** that have a dropdown menu inside
                */
                Array.from(verticalUl[0].getElementsByTagName('li')).forEach(verticalLi => {
                    const verticalUlDropdown = verticalLi.getElementsByTagName('ul');

                    if(verticalUlDropdown.length > 0) {
                        verticalUlDropdown[0].classList.remove('absolute');
                        verticalLi.removeEventListener('mouseenter', handleMouseEnter);
                        verticalLi.removeEventListener('mouseleave', handleMouseLeave);

                        const aElement = verticalLi.getElementsByTagName('a')[0];
                        aElement.verticalUlDropdown = verticalUlDropdown;
                        aElement.addEventListener(
                            'click', 
                            handleClick
                        );
                        updateBackgroundColor(
                            aElement,
                            verticalUlDropdown[0]
                        );
                    }
                });

                /*
                ** Remove 'visible' classes from horizontal and vertical
                ** dropdown menus when 'mouseleave' the horizontal Li
                */
                horizontalLi.addEventListener(
                    'mouseleave', 
                    handleMouseLeave
                );
            }
        });
    };

    const handleMouseEnter = (e) => {
        const verticalUl = e.currentTarget.verticalUl;
        Array.from(verticalUl[0].children).forEach(li => {
            li.classList.add('visible');
        });
    };

    const handleClick = (e) => {
        e.preventDefault();
        const verticalUlDropdown = e.currentTarget.verticalUlDropdown;
        Array.from(verticalUlDropdown[0].children).forEach(li => {
            li.classList.toggle('visible');
        });
    };

    const handleMouseLeave = (e) => {
        const verticalUl = e.currentTarget.verticalUl;
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
        let lastHorizontalElementWidth = 0;

        Array.from(horizontalUl.children).forEach(li => {
            totalLiWidth += li.offsetWidth;

            /*
            ** If there is not enough space to show the last horizontal
            ** element, append it to the 'more' dropdown.
            */ 
            if(totalLiWidth >= navWidth) {
                if(li.id === moreButton.id) {
                    const previousElementSibling = li.previousElementSibling;
                    if(previousElementSibling != null) {
                        moreBtnUl.insertBefore(
                            previousElementSibling,
                            moreBtnUl.firstChild
                        );
                    }
                } else {
                    lastHorizontalElementWidth = li.offsetWidth;
                    moreBtnUl.appendChild(li);
                }
                eventsRefresh = true;
                if(buttonNotAppended === true) appendButton = true;
            }
        });

        /* 
        ** Pull out the last element from the 'more' dropdown if there 
        ** is enough space in the horizontal menu.
        */
        if(totalLiWidth < navWidth) {
            if(buttonNotAppended === false) {
                let pullOut = false;
                const btnFirstElement = moreBtnUl.firstElementChild;
                
                // temporarily clone to get the offsetWidth of display:none element
                const clone = btnFirstElement.cloneNode( true );
                horizontalUl.appendChild(clone);
                let btnFirstElementWidth = clone.offsetWidth;
                horizontalUl.removeChild(clone);

                if(moreBtnUl.children.length > 1) {
                    if(btnFirstElementWidth+ totalLiWidth < navWidth) {
                        pullOut = true;
                    }
                } else if(moreBtnUl.children.length === 1) {
                    if(btnFirstElementWidth + totalLiWidth - moreButton.offsetWidth < navWidth) {
                        pullOut = true;
                    }
                }

                if(pullOut === true) {
                    horizontalUl.insertBefore(
                        btnFirstElement, 
                        horizontalUl.lastElementChild
                    );
                }

                if(moreBtnUl.children.length === 0) {
                    horizontalUl.removeChild(moreButton);
                }
                eventsRefresh = true;
            }
        }

        /*
        ** Append the button to the menu if it's not and has 
        ** elements inside.
        ** Also insert the last horizontal LI as firstChild into
        ** the 'more' dropdown to make space to show the button.
        */
        if(buttonNotAppended === true && appendButton === true) {
            const clone = moreButton.cloneNode( true );
            horizontalUl.appendChild(clone);
            moreButtonWidth = clone.offsetWidth;
            horizontalUl.removeChild(clone);

            if(totalLiWidth - lastHorizontalElementWidth + moreButtonWidth > navWidth) {
                moreBtnUl.insertBefore(
                    horizontalUl.lastElementChild, 
                    moreBtnUl.firstChild
                );
            }
            horizontalUl.appendChild(moreButton);
        }

        if(eventsRefresh === true) {
            refreshEvents();
        }
    };

    const createMoreButton = () => {
        const moreButton = document.createElement('li');
        moreButton.id = 'more-button-ds';
        moreButton.innerHTML = `<a href="#">+</a><ul class="dropdown"></ul>`;

        return moreButton;
    };

    const updateBackgroundColor = (a, dropdown) => {
        const aBg = window.getComputedStyle(a, null).getPropertyValue('background-color');
        let regex = /\d+/g;
        let rgbValues = aBg.match(regex);
        let newRgbArr = rgbValues.map(value => value = +value + 20);
        let newRgb = 'rgb('+newRgbArr[0]+', '+newRgbArr[1]+', '+newRgbArr[2]+')';

        Array.from(dropdown.getElementsByTagName('a')).forEach(a => {
            a.style.backgroundColor = newRgb;
        }); 
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