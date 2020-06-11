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
        $("#accountAddress").html("Your Account Address : " + App.account);
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
          var desc = patient[2];
          var amount = patient[3];
          var patients = `<div class='card-body'> <h3 class='card-title' id='patient_name'>Name: ${name}</h3> <h3 id='patient_id'>Id: ${id}</h2>   <button class="btn btn-danger" id="info">Show details</button> </div>`;
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
    var disease = $('#disease').val();
    var amount = $('#amount').val();
    var time = $('#time').val();      $("#form").hide();

    var date = $('#date').val();
    App.contracts.Health.deployed().then(function(instance){
      return instance.addPatient(name,disease,amount,date,time,{from: App.account});
    }).then(function(result){
      $("#content").hide();
      $("#loader").show();
      $("#form").hide();
      App.render();
    }).catch(function(err){
      console.error(err);
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
