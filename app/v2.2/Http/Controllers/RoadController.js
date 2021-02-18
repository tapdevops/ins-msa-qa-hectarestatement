const RoadModel = require(_directory_base + '/app/v2.2/Http/Models/RoadModel.js');
const HelperLib = require(_directory_base + '/app/v1.0/Http/Libraries/HelperLib.js');

exports.getRoad = (req, res) => {
    try {
        const { LOCATION_CODE_GROUP, REFFERENCE_ROLE } = req.auth
        var match, a, wrks, w, afd
        switch (REFFERENCE_ROLE) {
            case ('BA_CODE'):
                a = LOCATION_CODE_GROUP.map(wrks => {
                    return Number(wrks.slice(0, 4))
                })
                wrks = a.filter((item, index) => {
                    return a.indexOf(item) == index;
                })
                match = { WERKS: { $in: wrks } }
                break;
            case ('AFD_CODE'):
                w = LOCATION_CODE_GROUP.map(wrks => {
                    return Number(wrks.slice(0, 4))
                })
                a = LOCATION_CODE_GROUP.map(wrks => {
                    return wrks.slice(-1)
                })
                wrks = w.filter((item, pos) => {
                    return w.indexOf(item) == pos;
                })
                afd = a.filter((item, pos) => {
                    return a.indexOf(item) == pos;
                })

                match = {
                    $and: [
                        { WERKS: { $in: wrks } },
                        { AFDELING_CODE: { $in: afd } }
                    ]
                }
                break;
            case ('COMP_CODE'):
                match = { COMPANY_CODE: { $in: LOCATION_CODE_GROUP } }
                break;
            default:
                match = {}
                break;
        }
        console.log(req.auth);
        RoadModel.aggregate([
            {
                $project: {
                    "_id": 0,
                    "_v": 0
                }
            },
            {
                $match: match
            }
        ]).then(result => {
            res.send({
                status: true,
                message: 'success!',
                data: result
            })
        }).catch(err => {
            console.log(err)
            res.send({
                status: false,
                message: 'failed!',
                error: err
            })
        })
    } catch (err) {
        res.send(err, 'error')
    }
}
