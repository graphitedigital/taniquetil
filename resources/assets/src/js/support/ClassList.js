export default class ClassList {

    classList = [];

    /**
     * Add a class to the class list if a given condition is met.
     *
     * @param {string|Array|function} classes
     * @param {boolean|function} [condition]
     */
    add(classes, condition) {

        let con = arguments.length === 1 ? true : condition;

        let addToList = (c) => {

            let classList = typeof c === 'function'
                ? c()
                : c;

            if (Array.isArray(classList)) {
                this.classList = this.classList.concat(classList);
            } else {
                this.classList.push(classList);
            }
        };

        if (typeof con === 'function') {
            if (con()) {
                addToList(classes);
            }
        } else if (con) {
            addToList(classes);
        }
    }

    /**
     * Convert the instance to a string.
     *
     * @returns {string}
     */
    toString() {
        return this.classList.join(' ').trim();
    }

}
