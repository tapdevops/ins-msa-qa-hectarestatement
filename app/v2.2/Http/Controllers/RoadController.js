const RoadModel = require(_directory_base + '/app/v2.2/Http/Models/RoadModel.js');
const HelperLib = require(_directory_base + '/app/v1.0/Http/Libraries/HelperLib.js');

exports.getRoad = (req, res) => {
    try {
        const { LOCATION_CODE_GROUP, REFFERENCE_ROLE } = req.auth
        var match, a, wrks, w, afd, projection
        switch (REFFERENCE_ROLE) {
            case ('BA_CODE'):
                a = LOCATION_CODE_GROUP.map(wrks => {
                    return Number(wrks.slice(0, 4))
                })
                wrks = a.filter((item, index) => {
                    return a.indexOf(item) == index;
                })
                match = { WERKS: { $in: wrks } };
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
        console.log(match);
        RoadModel.aggregate([
            {
                $match: match
            }
        ]).then(data => {
            if (!data) {
                res.send({
                    status: true,
                    message: 'data not found!',
                    data: {}
                })
            } else {
                let result = [];
                if (data.length > 0) {
                    data.map(dt => {
                        result.push({
                            ROAD_CODE: dt.ROAD_CODE,
                            ROAD_NAME: dt.ROAD_NAME,
                            STATUS_PEKERASAAN: dt.STATUS_PEKERASAAN,
                            STATUS_AKTIF: dt.STATUS_AKTIF,
                        })
                    })
                }
                res.send({
                    status: true,
                    message: 'success!',
                    data: result
                })
            }

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

exports.syncMobile = (req, res) => {
    try {
        const { LOCATION_CODE_GROUP, REFFERENCE_ROLE } = req.auth
        var match, a, wrks, w, afd, projection
        var start_date = HelperLib.date_format(req.params.start_date, 'YYYYMMDDhhmmss');
        var end_date = HelperLib.date_format(req.params.end_date, 'YYYYMMDDhhmmss');
        console.log(start_date, end_date);
        console.log(req.auth);

        switch (REFFERENCE_ROLE) {
            case ('BA_CODE'):
                a = LOCATION_CODE_GROUP.map(wrks => {
                    return Number(wrks.slice(0, 4))
                })
                wrks = a.filter((item, index) => {
                    return a.indexOf(item) == index;
                })
                match = {
                    $and: [
                        { WERKS: { $in: wrks } },
                        {
                            $or: [
                                {
                                    CREATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    UPDATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    DELETED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                }
                            ]
                        }
                    ]
                }
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
                        { AFDELING_CODE: { $in: afd } },
                        {
                            $or: [
                                {
                                    CREATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    UPDATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    DELETED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                }
                            ]
                        }
                    ]
                }
                break;
            case ('COMP_CODE'):
                match = {
                    $and: [
                        { "COMPANY_CODE": { $in: LOCATION_CODE_GROUP } },
                        {
                            $or: [
                                {
                                    CREATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    UPDATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    DELETED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                }
                            ]
                        }
                    ]

                }
                break;
            default:
                match = {
                    $and: [
                        {
                            $or: [
                                {
                                    CREATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    UPDATED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                },
                                {
                                    DELETED_AT: {
                                        $gte: Number(start_date),
                                        $lte: Number(end_date)
                                    }
                                }
                            ]
                        }
                    ]
                }
                break;
        }
        console.log(match);
        RoadModel.aggregate([
            {
                $match: match
            }

        ]).then(data_insert => {
            var temp_insert = [];
            var temp_update = [];
            var temp_delete = [];

            data_insert.map(data => {

                if (data.DELETED_AT >= start_date && data.DELETED_AT <= end_date) {
                    temp_delete.push({
                        ROAD_CODE: data.ROAD_CODE,
                        ROAD_NAME: data.ROAD_NAME,
                        STATUS_PEKERASAAN: data.STATUS_PEKERASAAN,
                        STATUS_AKTIF: data.STATUS_AKTIF,
                    });
                }

                if (data.CREATED_AT > start_date && data.CREATED_AT < end_date) {
                    temp_insert.push({
                        ROAD_CODE: data.ROAD_CODE,
                        ROAD_NAME: data.ROAD_NAME,
                        STATUS_PEKERASAAN: data.STATUS_PEKERASAAN,
                        STATUS_AKTIF: data.STATUS_AKTIF,
                    });
                }
                if (data.UPDATED_AT >= start_date && data.UPDATED_AT <= end_date) {
                    temp_update.push({
                        ROAD_CODE: data.ROAD_CODE,
                        ROAD_NAME: data.ROAD_NAME,
                        STATUS_PEKERASAAN: data.STATUS_PEKERASAAN,
                        STATUS_AKTIF: data.STATUS_AKTIF,
                    });
                }
            });
            console.log(temp_insert.length);
            console.log(temp_update.length);
            console.log(temp_delete.length);
            res.json({
                status: true,
                message: 'Data Sync tanggal ' + HelperLib.date_format(req.params.start_date, 'YYYY-MM-DD') + ' s/d ' + HelperLib.date_format(req.params.end_date, 'YYYY-MM-DD'),
                data: {
                    "hapus": temp_delete,
                    "simpan": temp_insert,
                    "ubah": temp_update
                }
            });
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
