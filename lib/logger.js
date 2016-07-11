var handlebars = require('handlebars'),
    chalk = require('chalk');

var util = require('./util');

var Logger = util.Class({
    initialize: function ()
    {
        this.debug = false;
        this._isEnabled = false;
        this._msgs = [];

        this._initHandlebars();
    },
    info: function (msg)
    {
        this.color(msg, 'green');
    },
    error: function (msg)
    {
        this.color(msg, 'red');
    },
    log: function (msg)
    {
        this.color(msg, 'white');
    },
    debug: function (msg)
    {
        if (!this.debug) return;

        this.log(msg);
    },
    warn: function (msg)
    {
        this.color(msg, 'yellow');
    },
    color: function (msg, color)
    {
        this.tpl({msg: msg}, '{{#' + color + '}}{{msg}}{{/' + color + '}}');
    },
    history: function ()
    {
        return util.stripColor(this._msgs.join('\n'));
    },
    enable: function ()
    {
        this._isEnabled = true;
    },
    disable: function ()
    {
        this._isEnabled = false;
    },
    tpl: function (msg, tpl)
    {
        msg = handlebars.compile(tpl)(msg);

        this._log(msg);
    },
    _log: function (msg)
    {
        if (!this._isEnabled) return;

        this._msgs.push(msg);

        process.stdout.write(msg + '\n');
    },
    _initHandlebars: function ()
    {
        handlebars.registerHelper('rapd', function (len, ctx)
        {
            return util.rpad(ctx.fn(this), +len, ' ');
        });

        const SUPPORT_COLORS = ['yellow', 'green', 'cyan', 'red', 'white', 'magenta'];
        SUPPORT_COLORS.forEach(function (color)
        {
            handlebars.registerHelper(color, function (ctx)
            {
                return chalk[color](ctx.fn(this));
            });
        });
    }
});

module.exports = new Logger();