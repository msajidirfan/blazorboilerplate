using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BlazorBoilerplate.Server.Code
{
    public class SessionStorage
    {
        private ISession session;

        public SessionStorage(ISession session)
        {
            this.session = session;
        }

        public T GetFromSession<T>(string storageId, T defaultValue)
        {
            if (string.IsNullOrEmpty(session.GetString(storageId)))
            {
                session.SetString(storageId, JsonConvert.SerializeObject(defaultValue));
            }
            var value = session.GetString(storageId);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }

        public Dictionary<string, string> GetSurveys()
        {
            BlobManager BlobManagerObj = new BlobManager("snpdiscovery");
            string localPath = "questionnaire/";
            var blobSurveys = BlobManagerObj.GetBlobAsync(localPath);
            return GetFromSession<Dictionary<string, string>>("SurveyStorage", blobSurveys);
        }

        public Dictionary<string, List<string>> GetResults()
        {
            Dictionary<string, List<string>> results = new Dictionary<string, List<string>>();
            BlobManager BlobManagerObj = new BlobManager("snpdiscovery");
            string localPath = "responses" + "/" + "customername";
            //string localPath = System.IO.Path.Combine("responses", "customername");
            var blobSurveysDirectory = BlobManagerObj.GetBlobDirectoryList(localPath);
            foreach (var questionnaire in blobSurveysDirectory)
            {
                string sourceFile = localPath + "/" + questionnaire;
                var blobSurveys = BlobManagerObj.GetBlobAsync(sourceFile).Values.ToList();
                results[questionnaire] = blobSurveys;
            }
            return GetFromSession<Dictionary<string, List<string>>>("ResultsStorage", results);

        } 

        public string GetSurvey(string surveyId)
        {
            return GetSurveys()[surveyId];
        }

        public void StoreSurvey(string surveyId, string jsonString)
        {
            var storage = GetSurveys();


            // Container Name - picture  
            BlobManager BlobManagerObj = new BlobManager("snpdiscovery");
            // Create a file in your local MyDocuments folder to upload to a blob.
            string localPath = "questionnaire";
            string sourceFile = localPath + "/" + surveyId;
            var uploadStatus = BlobManagerObj.UploadTextToBlob(sourceFile, jsonString);

            if (!string.IsNullOrWhiteSpace(uploadStatus) & uploadStatus.Contains(surveyId.Trim().Replace(" ", "%20")))
            {
                storage[surveyId] = jsonString;
            }

            session.SetString("SurveyStorage", JsonConvert.SerializeObject(storage));
            //return task.Result;
        }

        //ToDo
        // ToDO -- Rename Responses container 
        public void ChangeName(string id, string name)  //name is new id
        {

            // Container Name - picture  
            BlobManager BlobManagerObj = new BlobManager("snpdiscovery");
            // Create a file in your local MyDocuments folder to upload to a blob.
            string localPath = "questionnaire";
            string sourceFile = localPath + "/" + name;
            string uploadStatus = "";

            var storage = GetSurveys();

            storage[name] = storage[id]; //adding new entry
            uploadStatus = BlobManagerObj.UploadTextToBlob(sourceFile, storage[id]);

            if (!string.IsNullOrWhiteSpace(uploadStatus) & uploadStatus.Contains(name.Trim().Replace(" ", "%20")))
            {
                storage.Remove(id);
                BlobManagerObj.DeleteBlob(localPath, id);
                // ToDO -- Rename Responses container 
            }
            session.SetString("SurveyStorage", JsonConvert.SerializeObject(storage));
        }

        public void DeleteSurvey(string surveyId)
        {
            BlobManager BlobManagerObj = new BlobManager("snpdiscovery");
            // Create a file in your local MyDocuments folder to upload to a blob.
            string localPath = "questionnaire";
            var storage = GetSurveys();
            if (storage.Remove(surveyId))
            {
                BlobManagerObj.DeleteBlob(localPath, surveyId);
            }
            session.SetString("SurveyStorage", JsonConvert.SerializeObject(storage));
        }

        public void PostResults(string postId, string resultJson)
        {
            var storage = GetResults();

            // Container Name 
            BlobManager BlobManagerObj = new BlobManager("snpdiscovery");
            // Create a file in your local MyDocuments folder to upload to a blob.
            string sourceFile = "responses" + "/" + "customername" + "/" + postId + "/" + Guid.NewGuid().ToString(); //responses/customername/QName/Attempt
            var uploadStatus = BlobManagerObj.UploadTextToBlob(sourceFile, resultJson); 
            
            if (!string.IsNullOrWhiteSpace(uploadStatus) & uploadStatus.Contains(postId.Trim().Replace(" ", "%20")))
            {
                if (!storage.ContainsKey(postId))
                {
                    storage[postId] = new List<string>();
                }
                storage[postId].Add(resultJson);
            }

            session.SetString("ResultsStorage", JsonConvert.SerializeObject(storage));
        }  

        public List<string> GetResults(string postId)
        {
            var storage = GetResults();
            return storage.ContainsKey(postId) ? storage[postId] : new List<string>();
        }
    }
}
