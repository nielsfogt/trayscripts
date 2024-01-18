// Useful little function to help clean up enum values as strings in case you need it
function cleanEnum(en){
  return JSON.stringify(en).replace(/\"/g,"")
}

function callTrayWebhook(e) {
  var result = {}
  if (e) {
    
    result = {
      form: {
        id : e.source.getId(),
        title : e.source.getTitle(),
        publicUrl : e.source.getPublishedUrl(),
        editUrl : e.source.getEditUrl(),
        description : e.source.getDescription(),
        responseId : e.response.getId(),
        email : e.response.getRespondentEmail()
      }
    }
  if(e.source.isQuiz() == true){
    var itemResponses = e.response.getGradableItemResponses()
  } else {
    var itemResponses = e.response.getItemResponses()
  }

    var responses = itemResponses.map(itemResponse=>{
      
      var item = itemResponse.getItem();
      var title = item.getTitle();
      var type = cleanEnum(item.getType());
      var helpText = item.getHelpText();
      var id = item.getId();
      // Likely need to test different question types here to get better understanding on how we might parse the answers and format as desired.
      var answer = JSON.stringify(itemResponse.getResponse());
      var answer = {
        "question" : title,
        "type" : type,
        "helpText" : helpText,
        "id" : id,
        "answer" : answer
      }
      if(e.source.isQuiz() == true){
        try {
          answer.score = itemResponse.getScore()
          answer.canScore = true
        } catch(err) {
          answer.canScore = false
        }
      }
      return answer
    });
    
    result.responses = responses
    result.success = true
    result.message = "Quiz response submission"
    
  } else {
    result.responses = null
    result.success = false
    result.message = "Script not able to parse form responses, check Appscript logs for more detail."
  }

  // Put your Tray webhook endpoint here. You get that from the workflow setting dialog (upper left corner under gear icon).
  // ex: https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.trayapp.io
  var url = "{{ FIX ME }}";
  var options = {
        "method": "post",
        "headers": {
            "Content-Type" : "application/json",
         //    "x-csrf-token" : "{{ FIX ME }}"
        },
        "payload": JSON.stringify(result)
    };
    var response = UrlFetchApp.fetch(url, options); 
}
