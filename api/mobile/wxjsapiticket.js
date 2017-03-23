var config = require('../frameConfig/frameConfig');


router.get('/',function(req,res){
    res.json(config.jsapiticket);
})

module.exports = router;