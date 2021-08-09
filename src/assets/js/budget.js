// import js files
import LS from "./ls";
import Validation from "./validation";
import UI from "./ui";

// everyyhing related to budget app operation
export default class Budget {
    _lsInstance = new LS;
    _validationInstance = new Validation;
    _uiInstance = new UI;
    _MONTHS = 'months';
    _CURRENT = 'current';

    constructor(month, week) {
        this.month = month;
        this.week = week;
    }

    // get budget from client
    _getBudget() {
        let budget = prompt('لطفا بودجه مدنظر خود را برای این هفته وارد کنید:');

        // check the budget type be number
        while (!this._validationInstance.isNumber(budget)) {
            budget = prompt('لطفا بودجه مدنظر خود را برای این هفته وارد کنید:');
        }

        return budget;
    }

    // search in months and returns all objects whose month key value is equal to the selected month of the current class
    _getCoordinatedMonthInfo() {
        const months = this._lsInstance.getInfo(this._MONTHS);

        return months.filter(o => o.month == this.month);
    }

    // initializing current keyName in localStorage 
    _initCurrent() {
        const months = this._lsInstance.getInfo(this._MONTHS);

        months.map(
            info => {
                if (info.month == this.month && info.week == this.week) {
                    this._lsInstance.setInfo(this._CURRENT, info);
                }
            }
        );
    }

    // update months keyName in localStorage
    _updateMonths(obj) {
        let months = this._lsInstance.getInfo(this._MONTHS);

        months.map(
            (info, index) => {
                if (info.month == this.month && info.week == this.week) {
                    months[index] = obj;
                }
            }
        );

        this._lsInstance.setInfo(this._MONTHS, months);
    }

    // delete expense
    deleteExpense(expenseID) {
        let info = this._lsInstance.getInfo(this._CURRENT);

        info.expenses.map(
            (expense, index) => {
                if (expense.id == expenseID) {
                    info.leftBudget = Number(info.leftBudget) + Number(expense.price);
                    info.expenses.splice(index, 1);
                }
            }
        );

        // update current in localStorage
        this._lsInstance.setInfo(this._CURRENT, info);

        // update months in localStorage
        this._updateMonths(info);

        // update UI
        this._uiInstance.updateAppBody();
        this._uiInstance.leftAmountLevelChange(info.leftBudget, info.budget); // check for left budget level Recovery
    }

    // initializing app and page
    init() {
        const appWrapper = document.querySelector('.app-wrapper');
        let months = this._lsInstance.getInfo(this._MONTHS);

        // check if week and month have been chosen before
        if (this._validationInstance.isInfoExistInArr(this.month, months)) {
            const coordinatedMonths = this._getCoordinatedMonthInfo();
            if (this._validationInstance.isInfoExistInArr(this.week, coordinatedMonths)) {
                    this._initCurrent();
                    this._uiInstance.updateAppBody();
                    this._uiInstance.leftAmountLevelChange(this._lsInstance.getInfo(this._CURRENT).leftBudget, this._lsInstance.getInfo(this._CURRENT).budget); // check for left budget level Recovery in UI
                    this._uiInstance.showElement(appWrapper);
                    return;
            }
        }

        this._uiInstance.hideElement(appWrapper);

        let budget = this._getBudget();
        let weekInfo = {
            month: this.month,
            week: this.week,
            budget: budget,
            leftBudget: budget,
            expenses: []
        };

        months.push(weekInfo);
        this._lsInstance.setInfo(this._MONTHS, months);
        this._lsInstance.setInfo(this._CURRENT, weekInfo);
        this._uiInstance.updateAppBody();
        this._uiInstance.leftAmountLevelChange(this._lsInstance.getInfo(this._CURRENT).leftBudget, this._lsInstance.getInfo(this._CURRENT).budget); // check for left budget level Recovery in UI
        this._uiInstance.showElement(appWrapper);
    }

    // run budget app
    run(expenseName, expensePrice) {

        // check if one of values is empty
        if ((expenseName == '' || expensePrice == '') ||
            (!this._validationInstance.isNumber(expensePrice))) {
            this._uiInstance.showMessage('لطفا مقادیر تمامی فیلد ها را کامل و صحیح وارد کنید', 'alert alert-danger text-center');
            return;
        }

        let weekInfo = this._lsInstance.getInfo(this._CURRENT);
        // check if price value is greather than left budget
        if (this._validationInstance.isGreatherThan(expensePrice, weekInfo.leftBudget)) {
            this._uiInstance.showMessage('نمی توانید بیش از باقی مانده بودجه خود هزینه کنید', 'alert alert-danger text-center');
            return;
        }

        // update left amount budget
        let leftAmount = Number(weekInfo.leftBudget) - Number(expensePrice);
        weekInfo.leftBudget = leftAmount;

        // if leftBudget was less than 20% or 50% of totalBudget
        this._uiInstance.leftAmountLevelChange(leftAmount, weekInfo.budget);

        // add expense information to weekInfo object
        weekInfo.expenses.push({
            name: expenseName,
            price: expensePrice,
            id: weekInfo.expenses.length + 1
        });

        // update current key name in localStorage
        this._lsInstance.setInfo(this._CURRENT, weekInfo);

        // update months key name in localStorage
        this._updateMonths(weekInfo);

        // update ui app body
        this._uiInstance.updateAppBody();
    }
}