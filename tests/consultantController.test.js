import {getUser,getUserDetails,getCountOfDoctors,generateRoster,saveRoster, getWardDoctorList} from '../controller/consultantController';
import { getMockReq, getMockRes } from '@jest-mock/express' ;
const Roster = require('../models/rosterSchema')


const { res, next, clearMockRes } = getMockRes() ;
const reqMocker = (data) => {
    const req = {}
    const body = {}
    Object.assign(body, data)
    req.body = body
    return req
 
}
const req = reqMocker({}) ;
const passReq = reqMocker({wardID : "test", roster: "test"})

Roster.prototype.save = jest.fn().mockImplementation(() => {
    res.status(200).json({success:true}) ;
}) ;
Roster.prototype.exists = jest.fn().mockImplementation((dataIn) => {
    return false ;
});



describe('testing the save roster function', () => {
    beforeEach(() => {
        clearMockRes() ;
    
        
    });

    test('should call the database save function', async() => {
        await saveRoster(passReq, res);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true
            })
        );
        

    });

    test('should return http error when given invalid req', async () => {
        await saveRoster(req,res) ;
        expect(res.status).toBeCalledWith(400)
    });


});

describe('testing get doctor id list', () => {
    test('should return a list',async () =>  {
        const wardID = "test" //integer input
        const doctors =await getWardDoctorList(wardID) ;
        
        expect(doctors).toBeInstanceOf(Array) ; 
                
        
    });
});


