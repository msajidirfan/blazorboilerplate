
window.surveyListFetchFunctions = {

    createSurvey: function (name, onCreate) {
        var baseUrl = "";
        var xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            baseUrl + "/api/service/create?name=" + name 
        );
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            var result = xhr.response ? JSON.parse(xhr.response) : null;
            !!onCreate && onCreate(xhr.status == 200, result, xhr.response);
            surveyListFetchFunctions.loadsurveys();
        };
        xhr.send();
    },
    loadsurveys : function () {
        var baseUrl = "";
        var accesskey = "";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + "/api/service/getactive?accesskey=" + accesskey);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            var result = xhr.response ? json.parse(xhr.response) : {};
            self.availablesurveys(
                object.keys(result).map(function (key) {
                    return {
                        id: key,
                        name: result[key].name || key,
                        survey: result[key].json || result[key]
                    };
                })
            );
        };
        xhr.send();
    },
    deleteSurvey: function (id, onDelete) {
        var baseUrl = "";
        var accesskey = "a";
        if (confirm("Are you sure?")) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", baseUrl + "/api/service/delete?accessKey=" + accessKey + "&id=" + id);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                var result = xhr.response ? JSON.parse(xhr.response) : null;
                !!onDelete && onDelete(xhr.status == 200, result, xhr.response);
            };
            xhr.send();
            window.location = "/";
        }
    },
    fetchSurveyList: function () {

        function SurveyManager(baseUrl, accessKey) {
            var self = this;
            //self.availableSurveys = ko.observableArray();

            self.loadsurveys = function () {
                var xhr = new xmlhttprequest();
                xhr.open("get", baseurl + "/api/service/getactive?accesskey=" + accesskey);
                xhr.setrequestheader("content-type", "application/x-www-form-urlencoded");
                xhr.onload = function () {
                    var result = xhr.response ? json.parse(xhr.response) : {};
                    self.availablesurveys(
                        object.keys(result).map(function (key) {
                            return {
                                id: key,
                                name: result[key].name || key,
                                survey: result[key].json || result[key]
                            };
                        })
                    );
                };
                xhr.send();
            };

            self.createSurvey = function (name, onCreate) {
                var xhr = new XMLHttpRequest();
                xhr.open(
                    "GET",
                    baseUrl + "/create?accessKey=" + accessKey + "&name=" + name
                );
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onload = function () {
                    var result = xhr.response ? JSON.parse(xhr.response) : null;
                    !!onCreate && onCreate(xhr.status == 200, result, xhr.response);
                };
                xhr.send();
            };

            self.deleteSurvey = function (id, onDelete) {
                if (confirm("Are you sure?")) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", baseUrl + "/delete?accessKey=" + accessKey + "&id=" + id);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onload = function () {
                        var result = xhr.response ? JSON.parse(xhr.response) : null;
                        !!onDelete && onDelete(xhr.status == 200, result, xhr.response);
                    };
                    xhr.send();
                    window.location = "/";
                }
            };

            //self.loadSurveys();
        }

        ko.applyBindings(
            new SurveyManager("", ""),
            document.getElementById("surveys-list")
        );
    }
};





window.surveyffetchFunctions = {
    fetchSurvey: function (surveyId) {

        var json = {
            "completedHtml": "<h3>Thank you for your feedback.</h3> <h5>Your thoughts and ideas will help us to create a great product!</h5>",
            "completedHtmlOnCondition": [
                {
                    "expression": "{nps_score} > 8",
                    "html": "<h3>Thank you for your feedback.</h3> <h5>We glad that you love our product. Your ideas and suggestions will help us to make our product even better!</h5>"
                }, {
                    "expression": "{nps_score} < 7",
                    "html": "<h3>Thank you for your feedback.</h3> <h5> We are glad that you share with us your ideas.We highly value all suggestions from our customers. We do our best to improve the product and reach your expectation.</h5>\n"
                }
            ],
            "pages": [
                {
                    "name": "page1",
                    "elements": [
                        {
                            "type": "rating",
                            "name": "nps_score",
                            "title": "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
                            "isRequired": true,
                            "rateMin": 0,
                            "rateMax": 10,
                            "minRateDescription": "(Most unlikely)",
                            "maxRateDescription": "(Most likely)"
                        }, {
                            "type": "checkbox",
                            "name": "promoter_features",
                            "visibleIf": "{nps_score} >= 9",
                            "title": "What features do you value the most?",
                            "isRequired": true,
                            "validators": [
                                {
                                    "type": "answercount",
                                    "text": "Please select two features maximum.",
                                    "maxCount": 2
                                }
                            ],
                            "hasOther": true,
                            "choices": [
                                "Performance", "Stability", "User Interface", "Complete Functionality"
                            ],
                            "otherText": "Other feature:",
                            "colCount": 2
                        }, {
                            "type": "comment",
                            "name": "passive_experience",
                            "visibleIf": "{nps_score} > 6  and {nps_score} < 9",
                            "title": "What is the primary reason for your score?"
                        }, {
                            "type": "comment",
                            "name": "disappointed_experience",
                            "visibleIf": "{nps_score} notempty",
                            "title": "What do you miss and what was disappointing in your experience with us?"
                        }
                    ]
                }
            ],
            "showQuestionNumbers": "off"
        };

        var survey = new Survey.Model(json);

        survey
            .onComplete
            .add(function (result) {
                document
                    .querySelector('#surveyResult')
                    .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
            });

        $("#surveyElement").Survey({ model: survey });
    }
}