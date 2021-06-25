"use strict";
// this file is only for drop down opperation in UI

const dropDownBtns = document.querySelectorAll('.drop-down-btn');

dropDownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const arrow = e.currentTarget.querySelector('svg');
        arrow.style.transition = '.5s';

        if (arrow.hasAttribute('data-drop-down')) {
            arrow.style.transform = 'rotate(180deg)';
            arrow.removeAttribute('data-drop-down');
        } else {
            arrow.style.transform = 'rotate(0deg)';
            arrow.setAttribute('data-drop-down', '');
        }
    });
});