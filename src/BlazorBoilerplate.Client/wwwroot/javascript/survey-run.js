// This file is to show how a library package may provide JavaScript interop features
// wrapped in a .NET API

window.surveyRunFunctions = {

    runSurvey: function (surveyId) {
        Survey.dxSurveyService.serviceUrl = "/api/service";
        // Load survey by id from url
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/service/getSurvey?surveyId=" + surveyId);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var result = xhr.response ? JSON.parse(xhr.response.split('Result":')[1].split('}"type')[0]) : {};
            var surveyModel = new Survey.Model(result);
            window.survey = surveyModel;
            survey
                .onComplete
                .add(function (result) {
                    surveyRunFunctions.saveSurveyResultFunc(surveyId, result.data);
                    document
                        .querySelector('#surveyResult')
                        .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
                });

            ko.cleanNode(document.getElementById("surveyElement"));
            document.getElementById("surveyElement").innerText = "";
            surveyModel.render("surveyElement");
        };
        xhr.send();
    },
    saveSurveyResultFunc: function (surveyId, resultdata, saveNo, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/service/post");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var data = { postId: surveyId, surveyResult: JSON.stringify(resultdata) };
        xhr.onload = function () {
            debugger;
            var result = xhr.response ? JSON.parse(xhr.response) : null;
            if (xhr.status === 200) {
                callback(saveNo, true);
            }
        };
        xhr.send(
            JSON.stringify(data)
        );
    }

};
