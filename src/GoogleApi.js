import * as shortid from "shortid";
import {Base64} from 'js-base64';

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
        this.loadApiAsync();
    }

    async loadApiAsync() {
        this.isAuthenticated = false;

        await this.loadScript('https://apis.google.com/js/api.js');
        await new Promise(resolve => window.gapi.load('client', resolve));

        let {api_key, client_id} = this.getAppInfo();
        let clientInfo = {
            apiKey: api_key,
            client_id: client_id,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: this.scopes.join(' '),
        };
        await window.gapi.client.init(clientInfo);
    }

    static encode(str) {
        return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    static buildHeader(components) {
        return components.map((item) => `${item.join(': ')}`).join('\r\n');
    }

    static async sendEmail(receivers, cc, bcc, subject, body, attachments) {
        if (!this.isAuthenticated) {
            try {
                let response = await window.gapi.auth2.getAuthInstance().signIn();
                if (response) {
                    this.isAuthenticated = true;
                }
            }
            catch (err) {
                this.isAuthenticated = false;
                return;
            }
        }

        let boundary = shortid.generate();
        let email = [];

        // Build the main header
        {
            let header = [
                [ 'Content-Type', `multipart/mixed; boundary="${boundary}"` ],
                [ 'MIME-Version', '1.0' ],
                [ 'From', 'me' ],
                [ 'To', receivers ],
                [ 'Subject', subject ],
            ];
            if (cc.length > 0) header.push([ 'Cc', cc ]);
            if (bcc.length > 0) header.push([ 'Bcc', bcc ]);
            email.push(GoogleApi.buildHeader(header));
        }

        email.push('');
        email.push(`--${boundary}`);

        // Main email
        email.push(GoogleApi.buildHeader([
            [ 'Content-Type', 'text/plain; charset=utf-8' ],
            [ 'Content-Transfer-Encoding', 'quoted-printable' ],
        ]));
        email.push('');
        email.push(body);

        // Generate attachment content
        (attachments || []).forEach((attachment) => {
            email.push('');
            email.push(`--${boundary}`);
            email.push(GoogleApi.buildHeader([
                [ 'Content-Type', `${attachment.contentType}` ],
                [ 'Content-Transfer-Encoding', 'base64' ],
                [ 'Content-Disposition', `attachment; filename="${attachment.filename}"` ]
            ]));
            email.push('');
            email.push(attachment.bytes);
        });

        email.push('');
        email.push(`--${boundary}--`);

        email = email.join('\r\n');

        let request = window.gapi.client.gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: Base64.encodeURI(email),
            },
        });
        return await new Promise((resolve, reject) => {
            request.execute((response) => {
                if(response.labelIds && response.labelIds.indexOf('SENT') > -1) {
                    resolve({
                        response: response,
                        success: true,
                    });
                }
                else {
                    if (response.error && response.error.code !== 200)
                        reject(response, response.error);
                    else reject(response);
                }
            })
        });
    }

}