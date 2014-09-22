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
        var re = /{{([^}}]+)?}}/,
            bracket = '',
            member = '';
        while (match = re.exec(html)) {
            bracket = match[0];
            member = $.trim(match[1]);
            var fu = new Function('member', '$model', 'return $model.' + member + ';');
            html = html.replace(bracket, fu(member, $model));
        }
        return html;
    }

    init();

}($));