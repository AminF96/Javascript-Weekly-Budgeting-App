// everything related to UI
class UI {

    // add active class to an element
    addActiveClass(parentElement, element) {
        // if there was'nt any element in parentElement with active class
        if (!validation.isClassExistsIn(parentElement, 'active')) {
            element.classList.add('active');
            return;
        }

        parentElement.querySelector('.active').classList.remove('active');
        element.classList.add('active');
    }

    // hide an element
    hideElement(element) {
        element.classList.add('d-none');
    }

    // show an hide element
    showElement(element) {
        if (element.classList.contains('d-none')) {
            element.classList.remove('d-none');
        }
    }

    // create expense li element
    _createExpenseLi(obj) {
        // create expense delete button
        const btn = document.createElement('button');
        btn.className = 'position-absolute del-btn';
        btn.id = obj.id;
        btn.innerHTML = '<i class="fas fa-calendar-times text-danger"></i>';

        // create expense li
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center justify-content-between position-relative px-4';
        li.innerHTML = `
            ${obj.name}
            <span class="badge badge-pill badge-success">${obj.price}</span>
        `;
        li.appendChild(btn);

        // when click happens on expense delete button
        btn.addEventListener('click', (e) => {
            new Budget().deleteExpense(e.currentTarget.id);
        });

        return li;
    }

    // update budget app body from the object that saved in current keyname in localStorage
    updateAppBody() {
        const info = ls.getInfo(CURRENT);

        document.querySelector('#total-budget').innerHTML = info.budget;
        document.querySelector('#left-budget').innerHTML = info.leftBudget;

        if (info.expenses == []) {
            return;
        }

        const expenses = document.querySelector('#expenses');
        expenses.innerHTML = '';
        info.expenses.map(
            expense => {
                document.querySelector('#expenses').appendChild(this._createExpenseLi(expense));
            }
        );
    }

    // update month and week buttons from information in localStorage
    updateMonthAndWeek() {
        const info = ls.getInfo(CURRENT);

        // fire click event on toggle buttons to show months and weeks list
        document.querySelectorAll('.drop-down-btn').forEach(btn => {
            btn.click();
        });

        // add active class to month and week that app is currently show their information
        this.addActiveClass(monthsWrapper, document.querySelector('#' + info.month));
        this.addActiveClass(weeksWrapper, document.querySelector('#' + info.week));
    }

    // show a message 
    showMessage(text, className) {
        // create message element
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = `
        <i class="fas fa-exclamation"></i> ${text}`;
        div.id = 'message'

        // show message
        form.insertBefore(div, document.querySelector('.form-group'));

        // remove message
        this._removeMessage();
    }

    // remove message after 3.5s
    _removeMessage() {
        setTimeout(() => {
            document.querySelector('#message').remove();
        }, 3500);
    }

    // actions need to happen when left budget's evel changes
    leftAmountLevelChange(leftAmount, totalAmount) {
        if (validation.isLessThanPerscent(leftAmount, totalAmount, 20)) {
            this._showBudgetChangeLevel(20, 'alert alert-danger');
        } else if (validation.isLessThanPerscent(leftAmount, totalAmount, 50)) {
            this._showBudgetChangeLevel(50, 'alert alert-warning');
        } else {
            this._showBudgetChangeLevel(0, 'alert alert-success');
        }
    }

    // show left budgets change levels
    _showBudgetChangeLevel(percentLevel, className) {
        const leftBudget = document.querySelector('#leftBudget-wrapper');
        leftBudget.className = className;
        
        if (percentLevel == 0) {
            return;
        }
        ui.showMessage(`شما بیش از ${percentLevel} درصد از بودجه خود را خرج کرده اید`, 'alert alert-danger text-center');
    }
}