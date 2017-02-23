import request from 'request';
import { jsonxml } from './lib/jsontoxml';

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

    this.ERRORS = {
      '1' : 'SMS başarıyla gönderildi.',
      '2'	: 'Bir alıcı girmelisiniz.',
      '3'	: 'Alıcı dizisinde hatalı eleman var.',
      '4'	: 'Bir SMS metni girmelisiniz.',
      '5'	: 'SMS gönderilecek tarih formatını hatalı girdiniz. (Format: Y-m-d H:i)',
      '6'	: 'Ayar dosyasında varsayılan SMS bağlığı boş olamaz.',
      '7'	: 'Birden fazla alıcıya birden fazla farklı mesaj tanımlanmış. Ancak alıcı sayısıyla mesaj sayısı uyuşmuyor.',
      '20': 'Geçersiz bir SMS hizmet sağlayıcı girdiniz.',
      '21': 'Seçtiğiniz SMS hizmet sağlayıcı için API adresi bulunmuyor.',
      '22': 'Geçersiz bir SMS başlığı(originator - senderID) girdiniz.',
      '900': 'İstek işlenirken teknik bir problem meydana geldi.',
      '901': 'SMS gönderilemedi. (Hizmet sağlayıcıdan dönen hata mesajı yakalanamadı)',
      '902': 'SMS gönderilemedi. (Parametre kontrolünde hata mevcut @todo)',
      '00': 'Sistem Hatası.',
      '20': 'Tanımsız Hata (XML formatını kontrol ediniz veya TURATEL’den destek alınız).',
      '21': 'Hatalı XML Formatı (\n - carriage return – newline vb içeriyor olabilir).',
      '22': 'Kullanıcı Aktif Değil.',
      '23': 'Kullanıcı Zaman Aşımında.',
      '01': 'Kullanıcı adı ya da şifre hatalı.',
      '02': 'Kredisi yeterli değil.',
      '03': 'Geçersiz içerik.',
      '04': 'Bilinmeyen SMS tipi.',
      '05': 'Hatalı gönderen ismi.',
      '06': 'Mesaj metni ya da Alıcı bilgisi girilmemiş.',
      '07': 'İçerik uzun fakat Concat özelliği ayarlanmadığından mesaj birleştirilemiyor.',
      '08': 'Kullanıcının mesaj göndereceği gateway tanımlı değil ya da şu anda çalışmıyor.',
      '09': 'Yanlış tarih formatı.Tarih ddMMyyyyhhmm formatında olmalıdır.',
    }
  }

  instance(options) {
    return jsonxml({
      MainmsgBody: {
        ...this.AUTH,
        ...options
      }
    }, this.OPTIONS);
  }

  getError(code) {
    return this.ERRORS[code];
  }

  send(Mesgbody, NumbersOut) {
    let Numbers = NumbersOut;

    if (_.isArray(NumbersOut)) {
      Numbers = NumbersOut.join(',');
    }

    const instance = this.instance({ Mesgbody, Numbers });

    if (this.OPTIONS.debug) {
      console.log(instance)
    }

    if (this.OPTIONS.sendSms) {
      request.post({
        url: this.SEND_URL,
        body : instance,
        headers: { 'Content-Type': 'text/xml' }
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const err = this.getError(body);
          if (err) {
            return console.log(err);
          }

          console.log(body, '- Mesaj başarılı şekilde gönderildi.');
        }
      });
    }
  }
}
