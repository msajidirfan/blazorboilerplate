var surveyName = "";
function setSurveyName(name) {
  var $titleTitle = jQuery("#sjs_survey_creator_title_show");
  $titleTitle.find("span:first-child").text(name);
}
function startEdit() {
  var $titleSurveyCreator = jQuery("#sjs_survey_creator_title_edit");
  var $titleTitle = jQuery("#sjs_survey_creator_title_show");
  $titleTitle.hide();
  $titleSurveyCreator.show();
  $titleSurveyCreator.find("input")[0].value = surveyName;
  $titleSurveyCreator.find("input").focus();
}
function cancelEdit() {
  var $titleSurveyCreator = jQuery("#sjs_survey_creator_title_edit");
  var $titleTitle = jQuery("#sjs_survey_creator_title_show");
  $titleSurveyCreator.hide();
  $titleTitle.show();
}
function postEdit() {
  cancelEdit();
  var oldName = surveyName;
  var $titleSurveyCreator = jQuery("#sjs_survey_creator_title_edit");
  surveyName = $titleSurveyCreator.find("input")[0].value;
  setSurveyName(surveyName);
  jQuery
    .get("/changeName?id=" + surveyId + "&name=" + surveyName, function(data) {
      surveyId = surveyName;
      window.location = "survey-creator.html?id=" + surveyName;
    })
    .fail(function(error) {
      surveyName = oldName;
      setSurveyName(surveyName);
      alert(JSON.stringify(error));
    });
}

//function getParams() {
//  var url = window.location.href
//    .slice(window.location.href.indexOf("?") + 1)
//    .split("&");
//  var result = {};
//  url.forEach(function(item) {
//    var param = item.split("=");
//    result[param[0]] = param[1];
//  });
//  return result;
//}



window.surveyCreatorFunctions = {
    editSurvey: function (surveyId) {
        debugger;
        var surveyName = "";
        function setSurveyName(name) {
            var $titleTitle = jQuery("#sjs_survey_creator_title_show");
            $titleTitle.find("span:first-child").text(name);
        }
        function startEdit() {
            var $titleSurveyCreator = jQuery("#sjs_survey_creator_title_edit");
            var $titleTitle = jQuery("#sjs_survey_creator_title_show");
            $titleTitle.hide();
            $titleSurveyCreator.show();
            $titleSurveyCreator.find("input")[0].value = surveyName;
            $titleSurveyCreator.find("input").focus();
        }
        function cancelEdit() {
            var $titleSurveyCreator = jQuery("#sjs_survey_creator_title_edit");
            var $titleTitle = jQuery("#sjs_survey_creator_title_show");
            $titleSurveyCreator.hide();
            $titleTitle.show();
        }
        function postEdit() {
            cancelEdit();
            var oldName = surveyName;
            var $titleSurveyCreator = jQuery("#sjs_survey_creator_title_edit");
            surveyName = $titleSurveyCreator.find("input")[0].value;
            setSurveyName(surveyName);
            jQuery
                .get("/changeName?id=" + surveyId + "&name=" + surveyName, function (data) {
                    surveyId = surveyName;
                    window.location = "survey-creator.html?id=" + surveyName;
                })
                .fail(function (error) {
                    surveyName = oldName;
                    setSurveyName(surveyName);
                    alert(JSON.stringify(error));
                });
        }


        Survey.dxSurveyService.serviceUrl = "";
        var accessKey = "";
        var surveyCreator = new SurveyCreator.SurveyCreator("survey-creator");
        surveyCreator.loadSurvey(surveyId);
        surveyCreator.saveSurveyFunc = function (saveNo, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                Survey.dxSurveyService.serviceUrl + "/changeJson?accessKey=" + accessKey
            );
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onload = function () {
                var result = xhr.response ? JSON.parse(xhr.response) : null;
                if (xhr.status === 200) {
                    callback(saveNo, true);
                }
            };
            xhr.send(
                JSON.stringify({
                    Id: surveyId,
                    Json: surveyCreator.text,
                    Text: surveyCreator.text
                })
            );
        };
        surveyCreator.isAutoSave = true;
        surveyCreator.showState = true;
        surveyCreator.showOptions = true;

        surveyName = surveyId;
        setSurveyName(surveyName);





        //var apiRoute = "/getSurvey?surveyId=" + surveyId;
        //var jsonQuestionnaire = SurveyHttpRequest(apiRoute, "");
        //Survey.dxSurveyService.serviceUrl = "";
        ////var apiRoute = "/getSurvey?accessKey=" + accessKey + "&surveyId=" + surveyId;        

        //window.survey = new Survey.Model(jsonQuestionnaire);

        //survey
        //    .onComplete
        //    .add(function (result) {
        //        document
        //            .querySelector('#surveyResult')
        //            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
        //    });

        //$("#surveyElement").Survey({ model: survey });

    }
};
