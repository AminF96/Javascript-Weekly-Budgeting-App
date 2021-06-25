// everyyhing related to budget app operation
class Budget {
    constructor(month, week) {
        this.month = month;
        this.week = week;
    } 

    // get budget from client
    _getBudget() {
        let budget = prompt('لطفا بودجه مدنظر خود را برای این هفته وارد کنید:');

        // check the budget type be number
        while (!new Validation().isNumber(budget)) {
            budget = prompt('لطفا بودجه مدنظر خود را برای این هفته وارد کنید:');
        }

        return budget;
    }

    // initializing current keyName in localStorage 
    _initCurrent() {
        const months = ls.getInfo(MONTHS);

        months.map(
            info => {
                if (info.month == this.month && info.week == this.week) {
                    ls.setInfo(CURRENT, info);
                }
            }
        );
    }

    // update months keyName in localStorage
    _updateMonths(obj) {
        let months = ls.getInfo(MONTHS);

        months.map(
            (info, index) => {
                if (info.month == this.month && info.week == this.week) {
                    months[index] = obj;
                }
            }
        );

        ls.setInfo(MONTHS, months);
    }

    // delete expense
    deleteExpense(expenseID) {
        let info = ls.getInfo(CURRENT);

        info.expenses.map(
            (expense, index) => {
                if (expense.id == expenseID) {
                    info.leftBudget = Number(info.leftBudget) + Number(expense.price);
                    info.expenses.splice(index, 1);
                }
            }
        );

        // update current in localStorage
        ls.setInfo(CURRENT, info);
        
        // update months in localStorage
        this._updateMonths(info);
        
        // update UI
        ui.updateAppBody();
        ui.leftAmountLevelChange(info.leftBudget, info.budget); // check for left budget level Recovery
    }

    // initializing app and page
    init() {
        let months = ls.getInfo(MONTHS);

        // check if week and month have been chosen before
        if (validation.isInfoExistsInObj(this.month, months) && validation.isInfoExistsInObj(this.week, months)) {
            this._initCurrent();
            ui.updateAppBody();
            ui.showElement(appWrapper);
            return;
        }

        ui.hideElement(appWrapper);

        let budget = this._getBudget();
        let weekInfo = {
            month: this.month,
            week: this.week,
            budget: budget,
            leftBudget: budget,
            expenses: []
        };

        months.push(weekInfo);
        ls.setInfo(MONTHS, months)
        ls.setInfo(CURRENT, weekInfo);
        ui.updateAppBody();
        ui.showElement(appWrapper);
    }

    // run budget app
    run(expenseName, expensePrice) {

        // check if one of values is empty
        if ((expenseName == '' || expensePrice == '') ||
            (!validation.isNumber(expensePrice))) {
            ui.showMessage('لطفا مقادیر تمامی فیلد ها را کامل و صحیح وارد کنید', 'alert alert-danger text-center');
            return;
        }

        let weekInfo = ls.getInfo(CURRENT);
        // check if price value is greather than left budget
        if (validation.isGreatherThan(expensePrice, weekInfo.leftBudget)) {
            ui.showMessage('نمی توانید بیش از باقی مانده بودجه خود هزینه کنید', 'alert alert-danger text-center');
            return;
        }

        // update left amount budget
        let leftAmount = Number(weekInfo.leftBudget) - Number(expensePrice);
        weekInfo.leftBudget = leftAmount;

        // if leftBudget was less than 20% or 50% of totalBudget
        ui.leftAmountLevelChange(leftAmount, weekInfo.budget);

        // add expense information to weekInfo object
        weekInfo.expenses.push({
            name: expenseName,
            price: expensePrice,
            id: weekInfo.expenses.length + 1
        });

        // update current key name in localStorage
        ls.setInfo(CURRENT, weekInfo);

        // update months key name in localStorage
        this._updateMonths(weekInfo);

        // update ui app body
        ui.updateAppBody();
    }
}