ethereum.enable()
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else {
      App.web3Provider = new web3.providers.HttpProviders('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Health.json", function (health) {
      App.contracts.Health = TruffleContract(health);
      App.contracts.Health.setProvider(App.web3Provider);
      return App.render();
    });
  },

  // events : function(){
  //   App.contracts.Health.deployed().then(function(i){
  //     i.addingPatient({},{
  //       fromBlock : 0,
  //       toBlock : 'latest'
  //     }).watch(function(err,event){
  //       console.log("Event Tiggred",event);
  //       App.render();
  //     })
  //   })
  // },

  render: function () {
    var healthInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("<h4>Your Account Address :</h4> " + App.account);
      }
    });


    App.contracts.Health.deployed().then(function (instance) {
      healthInstance = instance;
      return healthInstance.patientCount();
    }).then(function (patientCount) {
      var patientsInfo = $("#patientsList");
      patientsInfo.empty();

      for (var i = 1; i <= patientCount; i++) {
        healthInstance.patients(i).then(function (patient) {
          var id = patient[0];
          var name = patient[1];
          var patients = `<div class='card-body'> <div class='row'><h3 class='col-md-6 card-title' id='patient_name'>Name: ${name}</h3> <h3  class='col-md-3' id='patient_id'>Id : ${id}</h2> <button class="btn btn-success col-md-2" onClick="App.showDetails(this); return false;" id="info" data-id='${id}'>Show details</button></div> </div>`;
          patientsInfo.append(patients);
        });
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });

  },

  addPatient:  function(){
    var name = $('#name').val();
    var age = $('#age').val();
    var grp = $('#grp').val();
    var status = $('#status').val();   
    var treatment = $('#treatment').val();  
    var date = $('#date').val();
    App.contracts.Health.deployed().then(function(instance){
      return instance.addPatient(name,age,grp,status,treatment,date,{from: App.account});
    }).then(function(result){
      // $("#form").hide();
      $("#content").hide();
      $("#loader").show();
      App.render();
    }).catch(function(err){ 
      console.error(err);
    });
  },

  showDetails : function(id){
    // const btn = [...document.querySelectorAll("#info")];
    // console.log(btn);
    // var id = parseInt($('#info').val());
    // console.log(id)
    var Id = id.getAttribute("data-id");
    App.contracts.Health.deployed().then(function(i){
      return i.patients(Id);
    }).then(function(patients){
      document.getElementById("_id").innerHTML = "Id : "+Id;
      document.getElementById("_name").innerHTML = "Name : "+patients[1];
      document.getElementById("_age").innerHTML = "Age : "+patients[2].c[0];
      document.getElementById("_grp").innerHTML = "Blood Group : "+patients[3];
      document.getElementById("_status").innerHTML = "Health Status : "+patients[4];
      document.getElementById("_treatment").innerHTML = "Treatment : "+patients[5];
      document.getElementById("_date").innerHTML = "Date : "+patients[6];
    })
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
