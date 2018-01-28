# Botkit Starter Kit for Slack Bots


This repo is a stripped down version of the official Botkit starter kit.

Check out the full repo here: (https://github.com/howdyai/botkit-starter-slack)

Also checkout the official Botkit documentation repo here: (https://github.com/howdyai/botkit/blob/master/docs/readme.md#developing-with-botkit)

-------------------------------------------------------


## Steps to run the project

1. git clone the project.

    ```
        git clone git@github.com:chatbot-tutorials/slack-starter-chatbot.git
    ```

2. Install npm dependencies:

    ```
        npm install
    ```

3. start the npm server:

    ```
        npm start
    ```

4. start the ngrok http tunnelling server.

    ```
            ngrok http 3000
    ```

    this will provide http and https urls (eg. https://<unique_id>.ngrok.io)


##Steps to Connect with Slack:

1. visit [slask website](https://api.slack.com/apps). login and create the slack app using create new button. keep note of credentials.

2. click on side-panel's -- Bot Users: Add a New bot (name:xbot)

3. In Project folder : edit the .env file with required app credentials and restart the npm server

4. click on side-panel's -- OAuth & Permissions: Add redirect urls as

    ```
        https://<unique_id>.ngrok.io/oauth
    ```
    __Note:__ Make sure to save URLS

5. click on side-panel's -- Event Subscriptions:
    a. Enable Events click on
    b. add Request url as

    ```
        https://<unique_id>.ngrok.io/slack/receive
    ```
    make sure that request urls shows "Verified" any other error it means either tunneling server or npm server is not up

    c. Subscibe to bot events : message.channel and message.im

    __Note:__ Make sure to save changes


6. click on side-panel's -- Manage Distribution.
    a. Middle click on "Add to Slack" button: this will open a new tab - click on new tab
    b. set Post to > slackbot which is private to you
    c. click Authorize


Congratulations your slack app is bot is up and running


