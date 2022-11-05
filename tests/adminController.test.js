const {getUser, addUser} = require("../controller/adminController") ;
import { getMockRes } from "@jest-mock/express";
const Doctor = require ("../models/doctor") ;
const Consultant = require("../models/consultant") ;


//Mocking the req,res,next
const { res, next, clearMockRes } = getMockRes() ;

// mocking the req 
const doctorBody = {
    firstName: "first", 
    lastName: "second", 
    userName: "username", 
    wardID : "ward_id" ,
    address: "address", 
    emailaddress : "gmail@gmail.com", 
    telephone : "000" ,
    password : "password", 
    type : "1"
} ;


const consultantBody = { 

}



const reqMocker = (body) => {
    const req = {} ;
    req.body = body ;
    return req ;
}


const mockedReqDoc = reqMocker(doctorBody); 
const mockedReqNone = reqMocker() ;
const mockedReqEmpty = reqMocker({}) ;

//Mocking functions
Doctor.prototype.save = jest.fn().mockImplementation(() => {
    res.status(200).json({success:true}) ;
}) ;

describe('tests add user function with both types of users', () => {
    describe('testing with doctor', () => {
        beforeEach(() => {
            clearMockRes()
        });

        test('should pass with res.status 200', async () => {
            await addUser(mockedReqDoc,res) ;
            expect(res.status).toBeCalled() ;
            expect(res.status).toBeCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                  }),
            );
        });

        test('should call res.status with 201 when passed req without body', async () => {
            await addUser (mockedReqNone,res) ; 
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        success: false,
                        msg: "must have a body"
                    }
                ),
            ) ;
        });

        test('should call res.status with 201 when passed req with a typeless body', async () => {
            await addUser (mockedReqEmpty,res) ; 
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining(
                    {
                        success: false,
                        msg: "empty body or type field invalid"
                    }
                ),
            ) ;
        });
    });

    describe('testing with consultant', () => {
        
    });
});



