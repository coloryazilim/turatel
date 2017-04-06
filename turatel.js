import request from 'request';
import { jsonxml } from './lib/jsontoxml';
import { STATUS } from './status';

export class Turatel {
  constructor(auth, options) {
    this.SEND_URL = 'http://processor.smsorigin.com/xml/process.aspx';
    this.AUTH = _.extend({
      Command: 0,
      PlatformID: 1,
      ChannelCode: '',
      UserName: '',
      PassWord: '',
      Type: 1,
      Originator: ''
    }, auth);

    this.OPTIONS = _.extend({
      xmlHeader: true,
      sendSms: true,
      debug: false
    }, options);
  }

  sendSmsProvider(options) {
    return jsonxml({
      MainmsgBody: {
        ...this.AUTH,
        ...options
      }
    }, this.OPTIONS);
  }

  checkSmsProvider() {
    return jsonxml({
      MainReportRoot: {
        Command: 6,
        ..._.omit(this.AUTH, ['Command', 'Type', 'Originator'])
      }
    })
  }

  send(Mesgbody, NumbersOut, callback) {
    let Numbers = NumbersOut;

    if (_.isArray(NumbersOut)) {
      Numbers = NumbersOut.join(',');
    }

    // export xml.
    const xmlData = this.sendSmsProvider({ Mesgbody, Numbers });

    if (this.OPTIONS.debug) {
      console.log(xmlData);
    }

    if (this.OPTIONS.sendSms) {
      request.post({
        url: this.SEND_URL,
        body : xmlData,
        headers: { 'Content-Type': 'text/xml' }
      }, (error, response, body) => {
        if (_.isEqual(response.statusCode, 200)) {

          if (this.OPTIONS.debug) {
            console.log(body, '- Mesaj başarılı şekilde gönderildi.');
          }

          return callback(body, STATUS[body]);
        }
      });
    }
  }

  checkSms(callback) {
    request.post({
      url: this.SEND_URL,
      body: this.checkSmsProvider(),
      headers: { 'Content-Type': 'text/xml' }
    }, (error, response, body) => {
      callback(error, parseInt(body));
    })
  }
}
