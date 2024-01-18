1. Open apps script from Google Form
2. Paste this script into the Google Apps script
3. Create and enable a webhook triggered workflow
4. Get public workflow URL by right clicking trigger and copying it
5. Paste the public wf url at the bottom of this script where it says {{ FIX ME }}
6. Optionally, if you add CSRF token to your webhook trigger, add it to the script
7. Save your script
8. Add an on form submit trigger to the callTrayWebhook() function
9. Submit your form and check that it made it to your wf
10. Questions? Ask in #worfklow-help in our Slack community
