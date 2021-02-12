const MenuDS = (() => {
    const menuNav = document.getElementById('menu-ds');
    const horizontalUl = menuNav.lastElementChild;

    const init = () => {
        /* 
        ** Add 'mouseenter' events to the horizontal 'li' elements 
        ** that have a dropdown menu inside
        */
        Array.from(horizontalUl.children).forEach(horizontalLi => {
            const verticalUl = horizontalLi.getElementsByTagName('ul');

            if(verticalUl.length > 0) {
                horizontalLi.addEventListener('mouseenter', e => {
                    e.preventDefault();
                    verticalUl[0].classList.add('visible');
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
                            verticalUlDropdown[0].classList.toggle('visible');
                        });
                    }
                });

                /*
                ** Remove 'visible' classes from horizontal and vertical
                ** dropdown menus when 'mouseleave' the horizontal Li
                */
                horizontalLi.addEventListener('mouseleave', e => {
                    e.preventDefault();
                    verticalUl[0].classList.remove('visible');

                    // Also remove 'visible' from the verticalUlDropdown
                    Array.from(verticalUl[0].getElementsByTagName('li')).forEach(verticalLi => {
                        const verticalUlDropdown = verticalLi.getElementsByTagName('ul');
    
                        if(verticalUlDropdown.length > 0) {
                            verticalUlDropdown[0].classList.remove('visible');
                        }
                    });
                });
            }
        });
    };

    return {init}
})();

MenuDS.init();