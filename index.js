const jsf = require('json-schema-faker');
const fs = require('fs');

const createEmail = (person) => {
    person.email = `${person.firstName}.${person.lastName}@myUniversity.edu`;
    return person;
}; 

jsf.extend('faker', () => {
    const faker = require('faker');
    faker.custom = {
        address: () => `${faker.address.streetAddress(true)}`,
    };
    return faker;
});

jsf.option({ 
    resolveJsonPath: true, 
    requiredOnly: false, 
    optionalsProbability: 0.1 
});

const classSchema = {
    type: "object",
    properties: {
        students: {
            type: "array",
            minItems: 120,
            maxItems: 160,
            uniqueItems: true,
            items: {
                $ref: "student"
            }
        },
        proffesors: {
            type: "array",
            minItems: 20,
            maxItems: 40,
            uniqueItems: true,
            items: {
                $ref: "professor"
            }
        },
        classes: {
            type: "array",
            minItems: 5,
            maxItems: 10,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    professor: {
                        jsonPath: {
                            path: "$..proffesors[*].id",
                            count: 1
                        }
                    },
                    students: {
                        type: "array",
                        minItems: 40,
                        maxItems: 45,
                        items: {
                            jsonPath: "$..students[*].id"
                        }
                    }
                },
                required: ["professor", "students"]
            }
        }
    },
    required: ["students", "proffesors", "classes"]
}

const refs = [
    {
        id: "student",
        type: "object",
        properties: {
            id: {
                type: "string",
                faker: "random.uuid"
            },
            firstName: {
                type: "string",
                faker: "name.firstName"
            },
            lastName: {
                type: "string",
                faker: "name.lastName"
            },
            address: {
                type: "string",
                faker: "custom.address"
            }
        },
        required: ["id", "firstName", "lastName", "email"]
    },
    {
        id: "professor",
        type: "object",
        properties: {
            id: {
                type: "string",
                faker: "random.uuid"
            },
            firstName: {
                type: "string",
                faker: "name.firstName"
            },
            lastName: {
                type: "string",
                faker: "name.lastName"
            },
            address: {
                type: "string",
                faker: "custom.address"
            }
        },
        required: ["id", "firstName", "lastName", "email", "address"]
    }
];

jsf.resolve(classSchema, refs).then((sample) => {
    sample.students = sample.students.map(createEmail);
    sample.proffesors = sample.proffesors.map(createEmail);
    fs.writeFile("sample_student_data.json", JSON.stringify(sample), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Mock data has been created");
        }
    });
}).catch((err) => console.log(err));
