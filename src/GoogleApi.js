import * as shortid from "shortid";

export default class GoogleApi {

    constructor() {

        this.getAppInfo = this.getAppInfo.bind(this);
        this.loadScript = this.loadScript.bind(this);
        this.loadApi = this.loadApi.bind(this);
        this.loadApiAsync = this.loadApiAsync.bind(this);
        //this.waitForLoadedFlag = this.waitForLoadedFlag.bind(this);
        /*
        this.getGApi = this.getGApi.bind(this);
        this.authorize = this.authorize.bind(this);
        this.connect = this.connect.bind(this);
        //*/

        this.scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.compose',
        ];

        this.intervalLoadingApi = null;

        this.loadApi();
    }

    getAppInfo() {
        return {
            api_key: 'AIzaSyBJyXk-iJItnWmTPlS30TeSmgefP-ThyrM',
            client_id: '797448479815-86qmk7gti3rvoqhtbgr9gt3vibg9peda.apps.googleusercontent.com',
            client_secret: 'EvU7R3dmSuYdm97DxE6fosyL',
        };
    }

    loadScript(scriptUrl) {
        let script = document.createElement('script');
        script.src = scriptUrl;
        //script.async = true;
        return new Promise((resolve, reject) => {
            script.onload = () => resolve(script);
            document.body.appendChild(script);
        });
    }

    loadApi() {
        let promise = this.loadApiAsync();
    }

    async loadApiAsync() {
        let script = await this.loadScript('https://apis.google.com/js/api.js');
        await new Promise(resolve => window.gapi.load('client', resolve));

        console.log(window.gapi);

        let {api_key, client_id} = this.getAppInfo();
        let clientInfo = {
            apiKey: api_key,
            client_id: client_id,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: this.scopes.join(' '),
        };
        await window.gapi.client.init(clientInfo);
        //await this.sendEmail('dustin.yost.t@gmail.com', [], [], 'EVT Test ' + shortid.generate(), 'this is a test');
    }

    async sendEmail(receiver, cc, bcc, subject, body) {
        await window.gapi.auth2.getAuthInstance().signIn();
        let headers = [
            [ 'To', receiver ],
            [ 'From', 'me' ],
            [ 'Subject', subject ],
            //[ 'Content-Type', 'text/plain; charset=utf-8' ],
            //[ 'MIME-Version', '1.0' ],
        ];
        if (cc) headers.push([ 'Cc', cc ]);
        if (bcc) headers.push([ 'Bcc', bcc ]);

        let email = headers.map((headerItem) => `${headerItem.join(': ')}\r\n`).join('');
        email = `${email}\r\n${body}`;

        let request = window.gapi.client.gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
            },
        });
        /*
        https://developers.google.com/gmail/api/v1/reference/users/messages/send#examples
        // Using the js-base64 library for encoding:
        // https://www.npmjs.com/package/js-base64
        var base64EncodedEmail = Base64.encodeURI(email);
        */
        return await new Promise((resolve, reject) => {
            request.execute((response) => {
                if (response.error && response.error.code !== 200)
                    reject(response.error);
                else resolve(response);
            })
        });
    }

}