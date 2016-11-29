import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod } from '@angular/http';
import { LogService } from './log.service';
import { Toast } from './toast.service'

@Injectable()
export class FileService {

    constructor(
        private http: Http,
        private LOG: LogService,
        private T: Toast
    ) {

    }

    public uploadFile(filename, data: any): Promise<any> {

        return new Promise((resolve, reject) => {

            var queryHeaders = this.authHeader();

            this.T.toast('uploading file...' + filename);
            this.LOG.log('uploading file...', filename);

            //this.T.toast('uploading data...' + data);

            try {

                let params = {
                    filename: filename,
                    filedata: data
                };

                let headers = this.authHeader();
                headers.append('Content-Type', 'application/json');
                //headers.append('Filename', filename);
                //headers.append('Filedata', JSON.stringify(data));

                let options = new RequestOptions({
                    method: RequestMethod.Post,
                    url: this.fileUploadUrl,
                    headers: headers,
                    body: params
                });
                this.http.request(new Request(options))
                    //.map(res => res.json())
                    .subscribe(
                    resp => {
                        try {
                            this.T.toast('success! - ' + resp);
                            this.LOG.log('FileService resp:', resp);
                        } catch (ex) {
                            this.LOG.log('fileservice ex', ex);
                        }
                        resolve(resp);
                    },
                    err => {
                        try {
                            this.T.toast('error! - ' + err);
                            this.LOG.error('FileService err:', err);
                        } catch (ex) {
                            this.LOG.log('fileservice ex', ex);
                        }
                        reject(err);
                    },
                    () => {
                        this.T.toast('complete');
                    }
                    );

            } catch (ex) {
                this.LOG.error('fileservice exception:', ex);
                this.T.toast('fileservice exception : ' + JSON.stringify(ex));
                reject(ex);
            }
        })

    }

    fileUploadUrl = 'https://api.backand.com/1/objects/action/Test/1?name=files';


    // Auth info for Backand
    private auth_token = { header_name: 'AnonymousToken', header_value: 'f53fd52e-dec6-41c8-93b4-daef813ebdbe' };
    private authHeader(): Headers {
        var authHeader = new Headers();
        authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
        return authHeader;
    }
}