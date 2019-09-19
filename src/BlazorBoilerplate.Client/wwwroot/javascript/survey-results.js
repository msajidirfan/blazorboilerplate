window.surveyResultsFunctions = {
    loadSurvey: function (surveyId) {
        debugger;
        var surveyName = "";
        var _accessKey = "";
        var baseUrl = "";
        var results = [];
        var columns = [];
        Survey.dxSurveyService.serviceUrl = "";


        var survey = new Survey.Model({
            surveyId: surveyId,
            surveyPostId: surveyId
        });


        var xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + "/api/service/results?postId=" + surveyId);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            var result = xhr.response ? JSON.parse(xhr.response) : [];
            results(
                result.map(function (r) {
                    return JSON.parse(r || "{}");
                })
            );
            columns(
                survey.getAllQuestions().map(function (q) {
                    return {
                        data: q.name,
                        sTitle: (q.title || "").trim(" ") || q.name,
                        mRender: function (rowdata) {
                            return (
                                (typeof rowdata === "string"
                                    ? rowdata
                                    : JSON.stringify(rowdata)) || ""
                            );
                        }
                    };
                })
            );
            columns.push({
                targets: -1,
                data: null,
                sortable: false,
                defaultContent:
                    "<button style='min-width: 150px;'>Show in Survey</button>"
            });
            var table = $("#resultsTable").DataTable({
                columns: columns(),
                data: results()
            });

            var json = new Survey.JsonObject().toJsonObject(survey);
            var windowSurvey = new Survey.SurveyWindow(json);
            windowSurvey.survey.mode = "display";
            windowSurvey.survey.title = self.surveyId;
            windowSurvey.show();

            $(document).on("click", "#resultsTable td", function (e) {
                var row_object = table.row(this).data();
                windowSurvey.survey.data = row_object;
                windowSurvey.isExpanded = true;
            });
        };
        xhr.send();
                    

        //ko.applyBindings(new SurveyManager("", _accessKey, _surveyId),
        //    document.getElementById("resultsQuestionnaire"));


        $("#resultsQuestionnaire").Survey({ model: survey });
    }
};








//var surveyValueChanged = function (sender, options) {
//    var el = document.getElementById(options.name);
//    if (el) {
//        el.value = options.value;
//    }
//};

//var json = {
//    questions: [
//        {
//            type: "text",
//            name: "name",
//            title: "Your name:"
//        }, {
//            type: "text",
//            name: "email",
//            title: "Your e-mail"
//        }, {
//            type: "checkbox",
//            name: "car",
//            title: "What car are you driving?",
//            isRequired: true,
//            colCount: 4,
//            choices: [
//                "None",
//                "Ford",
//                "Vauxhall",
//                "Volkswagen",
//                "Nissan",
//                "Audi",
//                "Mercedes-Benz",
//                "BMW",
//                "Peugeot",
//                "Toyota",
//                "Citroen"
//            ]
//        }
//    ]
//};

//window.survey = new Survey.Model(json);

//survey
//    .onComplete
//    .add(function (result) {
//        document
//            .querySelector('#surveyResult')
//            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
//    });

//survey.data = {
//    name: 'John Doe',
//    email: 'johndoe@nobody.com',
//    car: ['Ford']
//};

//$("#surveyElement").Survey({ model: survey, onValueChanged: surveyValueChanged });
