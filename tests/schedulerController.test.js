const SchedulerController = require('../controller/schedulerController') 

const bodyPass = {

	"doctor_num" : 10,
    "shift_num" : 3,
    "days_num" : 10,
    "doctors_per_shift" : 2,
    "leave_requests" : [], 
    "preference_requests" : []
}

const emptyBody = {}

const bodyFail = {
    "doctor_num" : 10,
    "shift_num" : 3
} 


describe('tests the body validator code', () => {
    test('validator should return a boolean true for valid body', () => {
        const handler = new SchedulerController(bodyPass) 
        expect(handler.verifyBody()).toBeTruthy() ;     
    });
    test('should return false for invalid body', () => {
        const handler = new SchedulerController(bodyFail) ;
        expect(handler.verifyBody()).toBeFalsy() ;

    });
});

describe('tests the api sender method', () => {
    
    test('should call jwt token generator', () => {
        
        const handler = new SchedulerController(bodyPass) ; 
        handler.dispatchAPIRequest() ;

    });
});
