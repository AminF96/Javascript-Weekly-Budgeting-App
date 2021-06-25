'use strict';
// variables & constants
const MONTHS = 'months';
const CURRENT = 'current';
const appWrapper = document.querySelector('.app-wrapper');
const monthsWrapper = document.querySelector('#months');
const weeksWrapper = document.querySelector('#weeks');
const weeksMainParrent = document.querySelector('#weeks-wrapper');
const form = document.querySelector('#form');
const resetBtn = document.querySelector('#reset');

let chosenMonth; // for save the chosen month
let budget; // for create object from Budget class when user choose month and week and also use it on submit event in form

// clasess
const ui = new UI;
const ls = new LS;
const validation = new Validation;


// eventListeners
eventListeners();

function eventListeners() {
    // when page loaded
    document.addEventListener('DOMContentLoaded', (e) => {
        if (!localStorage.getItem('current')) {
            ui.hideElement(appWrapper);
            return;
        }

        chosenMonth = ls.getInfo(CURRENT).month;

        // recreate budget object for use it in app
        budget = new Budget(ls.getInfo(CURRENT).month, ls.getInfo(CURRENT).week);

        // update UI
        ui.showElement(weeksMainParrent);
        ui.updateMonthAndWeek();
        ui.updateAppBody();
        ui.leftAmountLevelChange(ls.getInfo(CURRENT).leftBudget, ls.getInfo(CURRENT).budget); // check for left budget level Recovery in UI
    });

    // when click happens on months wrapper
    monthsWrapper.addEventListener('click', (e) => {
        e.preventDefault();

        const {
            target
        } = e;

        if (target.classList.contains('month-btn')) {
            chosenMonth = target.id;
            ui.hideElement(appWrapper);

            if (weeksWrapper.querySelector('.active')) {
                weeksWrapper.querySelector('.active').classList.remove('active');
            }

            ui.addActiveClass(monthsWrapper, target);

            // show weeks for user to select (if weeks are hiden)
            ui.showElement(weeksMainParrent)
        }
    });

    // when click happens on weeks wrapper
    weeksWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        
        const {
            target
        } = e;

        if (target.classList.contains('week-btn')) {
            ui.addActiveClass(weeksWrapper, target);
            budget = new Budget(chosenMonth, target.id);
            budget.init();
        }
    });

    // when submit happens on budget form
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        budget.run(document.querySelector('#expense-name').value, document.querySelector('#expense-price').value);
    });

    // when click happens on reset button
    resetBtn.addEventListener('click', (e) => {
        ls.clear();
        location.reload();
    });
}