(function ($) {

    function init() {
        controller();
    }

    function personModel() {
        return {
            name: 'Sven Svensson',
            age: 65,
            phones: ['555-1234', '555-5678', '555-12414'],
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
                        var n = eval('$model.'+loopArr[0][1]+'.length');
                        for (var i=0; i<loopArr.length; i+=1) {
                            var modBracket = loopArr[i][0].substring(1, loopArr[i][0].length-1);
                            var list = eval('$model.'+loopArr[i][1]);
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
                var fu = new Function('$model', 'return $model.' + member + ';');
                html = html.replace(bracket, fu($model));
            }
        }
        return html;
    }

    init();

}($));