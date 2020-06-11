pragma solidity >=0.4.21 <0.7.0;

contract Health {
    struct Patient{
        uint id;
        string name;
        string disease;
        uint treatmentAmount;
        string date;
        string time;
    }

    mapping (uint=>Patient) public patients;

    uint public patientCount;

    constructor() public{
        addPatient("Ram Varma", "Fever and Cold", 100, "12/4/2020","02:00am");
        addPatient("Manish Mehera", "Typhoid", 234,"29/5/2020","05:34am");
    }

    function addPatient(string memory _name, string memory _disease, uint _amount, string memory _date, string memory _time) public{
        patientCount++;
        patients[patientCount] = Patient(patientCount, _name, _disease, _amount, _date, _time);
    }
}