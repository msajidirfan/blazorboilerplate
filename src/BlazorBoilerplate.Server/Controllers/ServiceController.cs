using BlazorBoilerplate.Server.Code;
using BlazorBoilerplate.Server.Middleware.Wrappers;
using BlazorBoilerplate.Server.Services;
using BlazorBoilerplate.Shared.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace BlazorBoilerplate.Server.Controllers
{

    public class ChangeSurveyModel
    {
        public string Id { get; set; }
        public string Json { get; set; }
        public string Text { get; set; }
    }

    public class PostSurveyResultModel
    {
        public string postId { get; set; }
        public string surveyResult { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : Controller
    {

        [HttpGet("getActive")]
        public async Task<ApiResponse> GetActive()
        {
            var db = new SessionStorage(HttpContext.Session);
            return new ApiResponse(200, "Retrieved Questionnaire", db.GetSurveys().Keys);
        }

        [HttpGet("getSurvey")]
        public string GetSurvey(string surveyId)
        {
            var db = new SessionStorage(HttpContext.Session);
            var a = db.GetSurvey(surveyId);
            return db.GetSurvey(surveyId);
        }

        [HttpGet("create")]
        public JsonResult Create(string name)
        {
            var db = new SessionStorage(HttpContext.Session);
            db.StoreSurvey(name, "{}");
            return Json("Ok");
        }

        [HttpGet("changeName")]
        public JsonResult ChangeName(string id, string name)
        {
            var db = new SessionStorage(HttpContext.Session);
            db.ChangeName(id, name);
            return Json("Ok");
        }

        [HttpPost("changeJson")]
        public string ChangeJson([FromBody]ChangeSurveyModel model)
        {
            var db = new SessionStorage(HttpContext.Session);
            db.StoreSurvey(model.Id, model.Json);
            return db.GetSurvey(model.Id);
        }

        [HttpGet("delete")]
        public JsonResult Delete(string id)
        {
            var db = new SessionStorage(HttpContext.Session);
            db.DeleteSurvey(id);
            return Json("Ok");
        }

        [HttpPost("post")]
        public JsonResult PostResult([FromBody]PostSurveyResultModel model)
        {
            var db = new SessionStorage(HttpContext.Session);
            db.PostResults(model.postId, model.surveyResult);
            return Json("Ok");
        }

        [HttpGet("results")]
        public JsonResult GetResults(string postId)
        {
            var db = new SessionStorage(HttpContext.Session);
            return Json(db.GetResults(postId));
        }
    }
}
