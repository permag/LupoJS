(function () {

    var mainController = function () {

        // fetch data from json
        LUPO.get('person-sample-data.json', function (data) {
            // render view
            LUPO.render('./views/main-view.html', LUPO.view, data);
        });

    }();

}());
