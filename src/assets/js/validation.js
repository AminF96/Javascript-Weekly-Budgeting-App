// everything related to validation
export default class Validation {

    // check is there any element in a parent Element with chosen className
    isClassExistsIn(wrapper, className) {
        const childs = wrapper.children;
        let existFlag = false;
        for (const element of childs) {
            if (element.classList.contains(className)) {
                existFlag = true;
            }
        }

        return existFlag;
    }

    // check that in an arey of objects , is there an specefic information
    isInfoExistInArr(info, arr) {
        let existFlag = false;
        arr.map(
            obj => {
                for (const key in obj) {
                    if (obj[key] == info) {
                        existFlag = true;
                    }
                }
            }
        );

        return existFlag;
    }

    // check input is a numberType or not
    isNumber(str) {
        if (Number(str)) {
            return true;
        }

        return false;
    }

    // Comparison two numbers that one of them is greather than outher one or not
    isGreatherThan(minNum, maxNum) {
        return Number(minNum) > Number(maxNum);
    }

    // Checks if one number is less than the selected percentage of the other number
    isLessThanPerscent(num, maxNum, percent) {
        const percMax = Number(maxNum) * (Number(percent) / 100);

        return Number(num) < percMax;
    }
}