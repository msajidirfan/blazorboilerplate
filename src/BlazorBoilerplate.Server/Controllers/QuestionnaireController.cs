using BlazorBoilerplate.Server.Middleware.Wrappers;
using BlazorBoilerplate.Server.Services;
using BlazorBoilerplate.Shared.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace BlazorBoilerplate.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionnaireController : ControllerBase
    {
        private readonly ILogger<QuestionnaireController> _logger;
        private readonly IQuestionnaireService _questionnaireService;

        public QuestionnaireController(IQuestionnaireService questionnaireService, ILogger<QuestionnaireController> logger)
        {
            _logger = logger;
            _questionnaireService = questionnaireService;
        }

        // GET: api/Todo
        [HttpGet]
        public async Task<ApiResponse> Get()
        {
            return await _questionnaireService.Get();
        }

        // GET: api/Todo/5
        [HttpGet("{id}")]
        public async Task<ApiResponse> Get(int id)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse(400, "Todo Model is Invalid");
            }
            return await _questionnaireService.Get(id);
        }

        // POST: api/Todos
        [HttpPut]
        public async Task<ApiResponse> Put([FromBody] QuestionnaireDto questionnaire)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse(400, "Todo Model is Invalid");
            }
            return await _questionnaireService.Create(questionnaire);
        }

        // POST: api/Todos
        [HttpPost]
        public async Task<ApiResponse> Post([FromBody] QuestionnaireDto questionnaire)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResponse(400, "Todo Model is Invalid");
            }
            return await _questionnaireService.Update(questionnaire);
        }

        // DELETE: api/Todos/5
        [HttpDelete("{id}")]
        public async Task<ApiResponse> Delete(long id)
        {
            return await _questionnaireService.Delete(id); // Delete from DB
        }
    }
}
