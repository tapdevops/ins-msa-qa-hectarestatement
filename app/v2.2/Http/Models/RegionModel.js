const mongoose = require('mongoose');

const RoadSchema = mongoose.Schema({
    REGION_CODE: String,
    COMP_CODE: String
});

module.exports = mongoose.model('REGION_v_2_2', RoadSchema, 'TM_COMP');
