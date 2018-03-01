/**
 * Escape a string for use in a regexp.
 *
 * @param {string} str
 * @returns {string}
 */
export function escape_for_regexp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Get a parameter from a query string.
 *
 * @param {string} string
 * @param {string} param
 * @returns {*|null}
 */
export function get_query_string_param(string, param) {
    let parsed = parse_query_string(string);
    return parsed[param] || null;
}

/**
 * Parse a query string.
 *
 * @param {string} string
 * @returns {{}}
 */
export function parse_query_string(string) {

    let query = {};
    let pairs = (string[0] === '?' ? string.substr(1) : string).split('&');

    pairs.forEach(pair => {
        let parts = pair.split('=');
        query[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
    });

    return query;
}

/**
 * Trim a string to a given number of characters.
 *
 * @param {string} str
 * @param {int} limit
 * @param {boolean} [wholeWord]
 * @returns {string}
 */
export function str_limit(str, limit, wholeWord = false) {

    let trimmed = str.substr(0, limit);

    if (wholeWord) {

        let index = trimmed.lastIndexOf(' ');

        return index > -1
            ? trimmed.substr(0, Math.min(trimmed.length, index))
            : trimmed;
    }

    return trimmed;
}