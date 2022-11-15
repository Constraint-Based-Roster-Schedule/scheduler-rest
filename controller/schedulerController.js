const jwt = require('jsonwebtoken');
require("dotenv").config();
const axios = require('axios'); 

class SchedulerController {
    constructor(body) {
        this.body = body ;
        this.url = "http://127.0.0.1:5000/schedule" //TODO: add remote server link here
    }

    verifyBody() {
        /* method checks the incoming request body to ensure all the fields are present*/  
        const reqFields = ["doctor_num","shift_num","days_num","doctors_per_shift","leave_requests","preference_requests"]
        const recievedKeys = Object.keys(this.body) 
        for (const key in reqFields) {
            console.log(key);
            console.log(recievedKeys.includes(reqFields[key]));
            if (recievedKeys.includes(reqFields[key])) {
                continue ;               
            } else {
                return false
            }
        }
        return true ;
    }
    generateAPIRequestBody() {
        /* performs conversions between body keys, depending on the frontend object */

    }

    async dispatchAPIRequest() {
        /**signes the token and sends a request to api */
        var resultOut ;
        const secToken = jwt.sign({"message": "hello"}, process.env.API_TOKEN_SECRET);
        const result = await axios({
            method: 'get',
            url: this.url,
            data: this.body,
            headers: {'access-token': secToken}
        }).then(apiResponse=>{
            if (apiResponse.status == 422) {
                return {message: "invalidConstraints", roster: []}
            } else {
                return {message: "success", roster: apiResponse.data.result}
            }
        }).catch(err => {return {message: err.message}})
        return result ;
    }
}

module.exports = SchedulerController;