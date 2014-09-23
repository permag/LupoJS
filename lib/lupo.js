var LUPO = (function ($) {

    // public members
    return {
        view: document.getElementById('view'),

        render: function (template, view, model) {
            $.ajax({
                url: template,
                method: 'GET',
                cache: false,
                success: function (html) {
                    view.innerHTML = htmlGenerator(html, model);
                },
                error: function () {
                    console.log('Error! Rendering template.');
                }
            });
        },

        get: function (url, callback) {
            $.ajax({
                url: url,
                method: 'GET',
                success: function (data) {
                    return callback(data[0]);
                },
                error: function () {
                    return callback({error: 'Error! Fetching data.'});
                }
            });
        }
    };

    // private members
    var cache = {};
    function htmlGenerator(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            htmlGenerator(document.getElementById(str).innerHTML) :

          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
           
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
           
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    }

    function getObjectByName(objName, context, args) {
        var args = [].slice.call(arguments).splice(2);
        var namespaces = objName.split(".");
        var func = namespaces.pop();
        var i, n = namespaces.length;
        for (var i = 0; i < n; i+=1) {
            context = context[namespaces[i]];
        }
        // return context[func].apply(this, args); // for functions

        if (args[0] !== null) {
            return context[func][args];
        } else {
            return context[func]; // for variables
        }
    }

}($, LUPO));
