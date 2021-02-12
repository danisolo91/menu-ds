const menuDS = (() => {
    const menuDiv = document.getElementById('menu-ds');
    const mainUl = menuDiv.lastElementChild;

    const render = () => {
        Array.from(mainUl.getElementsByTagName('li')).forEach(li => {
            // Check for dropdown elements
            const dropdownUl = li.getElementsByTagName('ul');
            if(dropdownUl.length > 0) {
                const aElem = li.getElementsByTagName('a')[0];
                aElem.addEventListener('click', e => {
                    e.preventDefault();
                    dropdownUl[0].classList.toggle('visible');
                });
            }
        });
    };

    return {render}
})();

menuDS.render();