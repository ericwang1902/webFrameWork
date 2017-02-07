var qiniu = require('qiniu');
var moment = require('moment');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'QvVRbBYWAGvCOYyD0BlWOSB9OLtqVYHPLyHHcFim';
qiniu.conf.SECRET_KEY = 'ac7rnJCgiGx3L9ka2B0U2n1lN7M8DPdAa48Rn1xK';

//要上传的空间
var bucket = 'afternoonteabucket';



//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}



//需要从客户端获取key的名字
module.exports = {
    getToken: function (req, res) {
        moment.locale('zh-cn');
        var currentKey = moment(new Date()).format('YYYY-MM-DD--HH-mm-ss');
        //生成上传 Token
        var token = uptoken(bucket, currentKey);
        
        return res.json({
            token: token,
            key: currentKey
        });
    }
}

