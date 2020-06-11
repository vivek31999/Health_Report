pragma solidity >=0.4.21 <0.7.0;

contract Health {
    struct Patient{
        uint id;
        string name;
        uint age;
        string bloodGroup;
        string healthStatus;
        string treatment;
        string date;
    }

    event addingPatient(uint _patientId);

    mapping (uint=>Patient) public patients;

    uint public patientCount;

    constructor() public{
        addPatient("Ram Varma", 32, "A+", "Fit","None","12/2/2019");
        addPatient("Manish Mehera", 23,"B+", "Fit","None","29/5/2020");
    }

    function addPatient(string memory _name,uint _age, string memory _bloodgrp, string memory _health,string memory _treatment,  string memory _date) public{
        patientCount++;
        patients[patientCount] = Patient(patientCount, _name, _age, _bloodgrp, _health, _treatment, _date);
        emit addingPatient(patientCount);
    }
}