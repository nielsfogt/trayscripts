1. Open apps script from Google Form/sheet
2. Paste script into the Google Apps script
3. Create and enable a webhook triggered workflow
4. Get public workflow URL by right clicking trigger and copying it
5. Paste the public wf url in the script where it's noted to be pasted
6. Optionally, if you add CSRF token to your webhook trigger, add it to the script and uncomment the header
7. Save your script
8. For Google Forms, add an on form submit trigger to the callTrayWebhook() function. For the Google Sheets script, add an on edit trigger to the callTrayWebhook() function.
9. Submit your form / edit your sheet and check that it made it to your wf
10. Questions? Ask in #worfklow-help in our Slack community

Re: Google Sheets Script
- It's setup to NOT send to webhook / workflow if...
  - The header rows are edited
  - Any data is missing from a given column 
- You must specfify which sheets you want to monitor; spelling and casing must match exactly
