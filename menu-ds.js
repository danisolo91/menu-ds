const MenuDS = (() => {
    const menuNav = document.getElementById('menu-ds');
    const horizontalUl = menuNav.lastElementChild;

    const addEvents = () => {
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

        /*
        ** Check with 'resize' event if there is enough space
        ** to show horizontal LI elements.
        */
       window.addEventListener('resize', e => {

       });
    };

    const applyResponsive = () => {
        /*
        ** If there is not enough space to show the horizontal
        ** elements, append the last LI element to the 'more' 
        ** dropdown.
        */ 
        const moreButton = createMoreButton();
        const moreBtnUl = moreButton.getElementsByTagName('ul')[0];

        let ulWidth = horizontalUl.offsetWidth;
        let totalLiWidth = 0;
        let showMoreBtn = false;

        Array.from(horizontalUl.children).forEach(li => {
            totalLiWidth += li.offsetWidth;

            if(totalLiWidth > ulWidth) {
                moreBtnUl.append(li);
                if(showMoreBtn === false) showMoreBtn = true;
            }
        });

        if(showMoreBtn === true) {
            /*
            ** Also insert the last horizontal LI as firstChild into
            ** the 'more' dropdown to make space to show the button.
            */
            moreBtnUl.insertBefore(
                horizontalUl.lastElementChild, 
                moreBtnUl.firstChild
            );
            horizontalUl.append(moreButton);
        }

        // DOTO: refreshEvents() instead and include there 
        // window.resize with a call to refreshResponsive()
        addEvents(); 
    };

    const createMoreButton = () => {
        const moreBtn = document.createElement('li');
        moreBtn.innerHTML = `<a href="#">More</a><ul class="dropdown"></ul>`;

        return moreBtn;
    };

    const init = () => {
        applyResponsive();
    };

    return { init }
})();

MenuDS.init();