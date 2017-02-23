# turatel
Turatel Sms Message Service for Meteor package.

``` javascript
const SMS = new Turatel({
  Command: 0,
  PlatformID: 1,
  ChannelCode: '',
  UserName: '',
  PassWord: '',
  Type: 1,
  Originator: ''
});

SMS.send(<Message>, <Phones String|List>)
```
