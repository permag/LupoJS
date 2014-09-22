(function ($) {

    function init() {
        controller();
    }

    function personModel() {
        return {
            name: 'Sven Svensson',
            age: 65,
            phones: ['555-1234', '555-56789'],
            houses: {resident: 'Morbacka', summer: 'Hedemora', ob: {test: 'test'}}
        }
    }

    function controller() {
        var view = document.getElementById('view');
        var $model = {
                person: personModel()
            };

        $.ajax({
            url: './part.html',
            method: 'GET',
            success: function (template) {
                view.innerHTML = templateGenerator(template, $model);
            },
            error: function () {
                console.log('Error...');
            }
        });
    }


    function templateGenerator(template, $model) {
        var re = /{{([^}}]+)?}}/g,
            bracket = '',
            member = '';
        while (match = re.exec(template)) {
            bracket = match[0];
            member = $.trim(match[1]);
            var fu = new Function('member', '$model', 'return $model.' + member + ';');
            console.log(member);
            template = template.replace(bracket, fu(member, $model));
        }
        return template;
    }

    init();

}($));