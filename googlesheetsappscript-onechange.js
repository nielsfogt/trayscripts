function sendSelectedSheetRowChangeToWebhook(e) {
    const webhookUrl = 'your webhook url'; 
    const sheetsToMonitor = ["Sheet1", "Sheet2", "Sheet3"]; // <<< IMPORTANT: List the names of sheets you want to monitor
  
    // Check if the event object 'e' exists
    if (!e) {
      Logger.log("Script was run manually, not by an edit event. Exiting.");
      SpreadsheetApp.getUi().alert("This script is designed to run on edit. Please make an edit in one of the monitored sheets.");
      return;
    }
  
    const range = e.range; // The edited range
    const sheet = range.getSheet(); // The sheet where the edit occurred
    const sheetName = sheet.getName();
    const rowNumberToSend = range.getRow(); // The row number that was edited
    const lastColumn = sheet.getLastColumn();
  
    // IMPORTANT: Check if the edited sheet is in our list of monitored sheets
    if (!sheetsToMonitor.includes(sheetName)) {
      Logger.log(`Edit occurred in sheet '${sheetName}', which is not monitored. Skipping webhook send.`);
      return;
    }
  
    // Optionally: Skip if the edit is in the header row (row 1)
    if (rowNumberToSend === 1) {
      Logger.log("Edit occurred in header row (row 1). Skipping webhook send.");
      return;
    }
  
    // Get headers from row 1 of the edited sheet
    const headerRange = sheet.getRange(1, 1, 1, lastColumn);
    const headers = headerRange.getValues()[0];
  
    // Get all values from the edited row
    const rowDataRange = sheet.getRange(rowNumberToSend, 1, 1, lastColumn);
    const rowValues = rowDataRange.getValues();
  
    // Basic check: if the row is empty after edit, don't send
    if (rowValues.length === 0 || rowValues[0].every(cell => cell === "")) {
      Logger.log("Edited row " + rowNumberToSend + " in sheet '" + sheetName + "' is empty. Not sending to webhook.");
      return;
    }
  
    // Check if all columns with headers have values
    const hasAllRequiredValues = headers.every((header, index) => {
      // Skip empty headers
      if (!header) return true;
      // Check if the corresponding value exists and is not empty
      return rowValues[0][index] !== undefined && rowValues[0][index] !== "";
    });
  
    if (!hasAllRequiredValues) {
      Logger.log("Not all required columns have values in row " + rowNumberToSend + ". Skipping webhook send.");
      return;
    }
  
    // Create a JSON object from headers and row data
    const payload = {
      "sheetName": sheetName, // Add the sheet name to the payload
      "rowNumber": rowNumberToSend // Add the row number to the payload
    };
  
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const value = rowValues[0][i];
      payload[header] = value;
    }
  
    // Options for the POST request
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload), // Convert the JavaScript object to a JSON string
      muteHttpExceptions: true // To get more detailed error messages if the request fails
    };
  
    try {
      const response = UrlFetchApp.fetch(webhookUrl, options);
      const responseCode = response.getResponseCode();
      const responseBody = response.getContentText();
  
      if (responseCode >= 200 && responseCode < 300) {
        Logger.log(`Successfully sent data from sheet '${sheetName}', row ${rowNumberToSend} to webhook.`);
        // Optionally display a brief success message in the sheet (can be intrusive for frequent edits)
        // SpreadsheetApp.getUi().alert("Success!", `Data from '${sheetName}' row ${rowNumberToSend} sent.`, SpreadsheetApp.getUi().ButtonSet.OK);
      } else {
        Logger.log(`Error sending data from sheet '${sheetName}', row ${rowNumberToSend}. Code: ${responseCode}, Body: ${responseBody}`);
        SpreadsheetApp.getUi().alert("Error!", `Failed to send data from sheet '${sheetName}' row ${rowNumberToSend}. Response Code: ${responseCode}`, SpreadsheetApp.getUi().ButtonSet.OK);
      }
    } catch (e) {
      Logger.log("Exception while sending data: " + e.message);
      SpreadsheetApp.getUi().alert("Error!", "An exception occurred: " + e.message, SpreadsheetApp.getUi().ButtonSet.OK);
    }
  }