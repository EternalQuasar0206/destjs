import { ExceptionDictionary } from "../../dictionaries/ExceptionDictionary";

class ConstraintGroup {
    //Type Constraints
    primitiveType?: string = "object";
    //Boolean Constraints
    isTrue?: boolean = false;
    //String Constraints
    maxLength?: number = 9999;
    minLength?: number = -9999;
    canHaveSideWhiteSpaces?: boolean = true;
    canHaveWhiteSpaces?: boolean = true;
    //Number Constraints
    maxSize?: number = 9999;
    minSize?: number = -9999;
    isFloating?: boolean = false;
    isNegative?: boolean = false;
    isInteger?: boolean = false;
}

class ValidationResult {
    //Type Constraints
    primitiveType?: boolean = false;
    //Boolean Constraints
    isTrue?: boolean = false;
    //String Constraints
    maxLength?: boolean = false;
    minLength?: boolean = false;
    canHaveSideWhiteSpaces?: boolean = false;
    canHaveWhiteSpaces?: boolean = false;
    //Number Constraints
    maxSize?: boolean = false;
    minSize?: boolean = false;
    isFloating?: boolean = false;
    isNegative?: boolean = false;
    isInteger?: boolean = false;
}

type ValidationExceptionGroup = string[];

var Teste:ConstraintGroup = {
    maxLength: 1
};

console.log(DestSanitize("sadsadw", Teste));

function DestSanitize(plain: any, template: any | ConstraintGroup) {
    let exceptionGroup: ValidationExceptionGroup = [];

    switch(typeof plain) {
        case "string":
            let strValidationResult: ValidationResult = {
                "primitiveType": false,
                "maxLength": false, 
                "minLength": false,
                "canHaveSideWhiteSpaces": false,
                "canHaveWhiteSpaces": false
            };

            Object.keys(template).forEach((constraint) => {
                switch(constraint) {
                    case "maxLength":
                        if(plain.length > template[constraint]!) {
                            strValidationResult["maxLength"] = true;
                            exceptionGroup.push(ExceptionDictionary(plain, template[constraint]!).MaxLengthError); 
                        }
                        break;

                    case "minLength":
                        if(plain.length < template[constraint]!) {
                            strValidationResult["minLength"] = true; 
                            exceptionGroup.push(ExceptionDictionary(plain, template[constraint]!).MinLengthError); 
                        }
                        break;

                    case "primitiveType":
                        if(typeof plain !== template[constraint]!) {
                            strValidationResult["primitiveType"] = true; 
                        }
                        break;

                    case "canHaveSideWhiteSpaces":
                        if(!template[constraint]! && /(^\s)|(\s$)/.test(plain)) {
                            strValidationResult["canHaveSideWhiteSpaces"] = true;
                        }
                        break;

                    case "canHaveWhiteSpaces":
                        if(!template[constraint]!) {
                            if(plain.indexOf(" ") != -1) {
                                strValidationResult["canHaveWhiteSpaces"] = true;
                            }
                        }
                        break;
                }
            });

            if(!Object.values(strValidationResult).toString().includes("true")) {
                return plain;
            }
            break;
            
            
        case "number":
            let numValidationResult: ValidationResult = {
                "primitiveType": false,
                "maxSize": false, 
                "minSize": false,
                "isFloating": false,
                "isInteger": false,
                "isNegative": false
            };

            Object.keys(template).forEach((constraint) => {
                switch(constraint) {
                    case "maxSize":
                        if(plain > template[constraint]!) {
                            numValidationResult["maxSize"] = true;
                        }
                        break;
                    
                    case "minSize":
                        if(plain < template[constraint]!) {
                            numValidationResult["minSize"] = true;
                        }
                        break;

                    case "isFloating":
                        if(!template[constraint]!) {
                            if(Number(plain) === plain && plain % 1 !== 0) {
                                numValidationResult["isFloating"] = true;
                            }
                        }
                        else if(template[constraint]!) {
                            if(!(Number(plain) === plain && plain % 1 !== 0)) {
                                numValidationResult["isFloating"] = true;
                            }
                        }

                        break;
                    
                    case "isInteger":
                        if(!template[constraint]!) {
                            if(Number(plain) === plain && plain % 1 === 0) {
                                numValidationResult["isInteger"] = true;
                            }
                        }
                        else if(template[constraint]!) {
                            if(!(Number(plain) === plain && plain % 1 === 0)) {
                                numValidationResult["isInteger"] = true;
                            }
                        }
                        break;

                    case "isNegative":
                        if(!template[constraint]!) {
                            if(Number(plain) < 0) {
                                numValidationResult["isNegative"] = true;
                            }
                        }
                        else if (template[constraint]!) {
                            if(Number(plain) > 0) {
                                numValidationResult["isNegative"] = true;
                            }
                        }
                }
            });

            if(!Object.values(numValidationResult).toString().includes("true")) {
                return plain;
            }
            break;
    }
    throw new TypeError(ExceptionDictionary().GenericSerializationFailure);
}