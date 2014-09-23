var ob = {
    person: {
        test: function () {
            return "HEJEHEHE";
        },
        value: "hej var",
        arr: [1, 2, 3, 4],
        objArr: {hej: [4, 5, 6]}
    }
};











(function ($) {

    function init() {
        controller();
    }

    function personModel() {
        return {
            name: 'Sven Svensson',
            age: 65,
            phones: ['555-1234', '555-5678', '555-9877'],
            houses: {resident: 'Morbacka', summer: 'Hedemora', ob: {test: 'test'}}
        }
    }

    function controller() {
        var view = document.getElementById('view');
        var $model = {
            person: personModel()
        };
        render('./part.html', view, $model);
    }

    function render(template, view, $model) {
        $.ajax({
            url: template,
            method: 'GET',
            cache: false,
            success: function (html) {
                view.innerHTML = htmlGenerator(html, $model);
            },
            error: function () {
                console.log('Error...');
            }
        });
    } 

    function htmlGenerator(html, $model) {
        var arr = [];
        var re = /{{([^}}]+)?}}/,
            bracket = '',
            member = '';
        while (match = re.exec(html)) {
            bracket = match[0];
            member = $.trim(match[1]);
            memberParam = member.match(/[^[\]]+(?=])/);
            if (memberParam) {
                member = member.replace('['+memberParam[0]+']', '');  // remove [x]
            }
            arr.push(member);
            var loop = member.substr(0, 4);
            if (loop === 'for ') {
                html = html.replace(bracket, '');
                var loopArr = [];
                while (loopMatch = re.exec(html)) {
                    loopBracket = loopMatch[0];
                    loopMember = $.trim(loopMatch[1]);  // e.g. phone
                    var loopData = member.split(' ')[3];  // e.g. member.phones
                    
                    if (loopMember === 'endfor') {
                        html = html.replace(loopBracket, '');  // remove endfor tag
   
                        for (var i=0; i<loopArr.length; i+=1) {
                            var modBracket = loopArr[i][0].substring(1, loopArr[i][0].length-1);
                            var list = getObjectByName(loopArr[i][1], $model, memberParam);

                            for (var y=0; y<list.length; y+=1) {
                                html += modBracket;
                                html = html.replace(modBracket, list[y]);
                            }
                            html = html.replace(modBracket, '');
                        }
                        break;
                    }

                    loopArr.push([loopBracket, loopData]);
                    html = html.replace(loopBracket, loopBracket.substring(1, loopBracket.length-1));
                }
            } else {
                var params;
                if (memberParam) {
                    params = memberParam;
                } else {
                    params = null;
                }
                html = html.replace(bracket, getObjectByName(member, $model, memberParam));
                
            }
        }
        return html;
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

    init();

}($));