const tokenAuth = require("../middleware/doctorAuthToken")
import { getMockReq, getMockRes } from '@jest-mock/express' ;
const JWT = require ("jsonwebtoken") 
require("dotenv").config();

const passCred = {userType:1, userID : 1999} ;
const passToken = JWT.sign (passCred, process.env.ACCESS_TOKEN_SECRET) ;

const reqMocker = (token) => {
    const req = {} ;
    const innerToken = token
    req.header = jest.fn().mockReturnValue(innerToken) ;
    return req ;
}
const mockedReq = reqMocker(passToken);


const { res, next, clearMockRes } = getMockRes() ;

describe('Tests the adminAuthToken by passing the method mocked req,res,next', () => {
    
    test('should return the token from req', () => {
        const token = mockedReq.header("x-auth-token")
        expect(token).toBeDefined();
        expect(token).toBe(passToken);
    });

    test('should add userID to the req for valid payload', async () => {
        await tokenAuth(mockedReq,res, next) ;
        expect(mockedReq.header("x-auth-token")).toBe(passToken);
        expect(mockedReq.userID).toBe(passCred.userID)
        expect(next).toBeCalled() ;
        
    });
});


