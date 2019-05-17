var $FQL = {};
$FQL.init = function() {};
$FQL.parse = function() {};
$FQL.query = function() {};
$FQL.on = function() {};
$FQL.off = function() {};
$FQL.tag = function() {};
$FQL.nav = function() {};
$FQL.debug = function() {};

var TOKEN_REGEX = {
    "whitespace": '',

    // query method
    "method": '',

    // path query operator
    "path_operator": '',
    "count_operator": '',

    "str": '',
    "and": '',
    "or": '',
    "comma": '',
    "fn_args_bool": '',

    // numeric
    "operator": '',
    "num": '',

    // date / time
    "time": '',
    "date": ''
};

// query token index
var QUERY_REGEX_INDEX = {
    "base": '',
    "path": '',
    "fn_args": '',
    "url_page": '',
    "page": '',
    "count": '',
    "since": ''
};

var QUERY_IGNORE_INDEX = {
    "global": '',
    "fn_args": ''
};

var QUERY_METHODS_INDEX = {
    "base": '',
    "path": '',
    "url_page": '',
    "page": '',
    "count": '',
    "since": ''
};

var QUERY_IGNORE_INDEX = {
    "global": '',
    "fn_args": ''
};

var parse_log = ['', [{
    fql: '',
    json: '',
    cache: ''
}]];

var query = [];
query[0] = {
    fn: '',
    args: '',
    funnel: '',
    url: '',
    regex: '',
    path: '',
    count: '',
    since: '',
    page: ''
};

var conditions = {
    minTime: '',
    maxTime: '',
    pathOffset: {
        date: '',
        path: ''
    },
    pathOperator: '',
    offset: '',
    count: '',
    pathRange: '',
    pathDepth: ''
};

var log = {
    visits: ''
}

function FunnelQL_Parser_Error(message, startLine, startCol, endLine, endCol) {
    this.name = '';
    this.message = message;
    this.startLine = startLine;
    this.startCol = startCol;
    this.endLine = endLine;
    this.endCol = endCol;
    this.toObject = function() {}
};

window.$FQL = $FQL;

window['funnelql-worker'] = '';