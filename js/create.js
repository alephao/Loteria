$(function() {
  var etherInWei = new BigNumber(1000000000000000000);

  if (typeof web3 !== undefined) {
    web3 = new Web3(web3.currentProvider);
  } else {
    alert("You need metamask to use this website");
  }

  var abi = [{"inputs":[{"name":"_numberOfTickets","type":"uint256"},{"name":"_ticketPrice","type":"uint256"},{"name":"_donate","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
  var lotteryContract = web3.eth.contract(abi);
  
  function getContractBytecode(callback) {
    $.get('./solcoutput/TicketLotteryGame.bin', function(data, a, b) {
      var bytecode = '0x' + data;
      callback(null, bytecode);
    });
  }

  function estimateGas(bytecode, callback) {
    web3.eth.estimateGas({data: bytecode}, function (error, estimatedGas) {
      callback(null, estimatedGas);
    });
  }

  $('#contract-address-container').hide();
  function showContractAddress(adress) {
    $('#contract-address').text(address);
    $('#contract-address-container').show();
  }

  function deployContract() {    
    var numberOfTickets = new BigNumber($('#number-of-tickets').val());
    var ticketPrice = (new BigNumber($('#ticket-price').val())).times(etherInWei);
    var donate = (new BigNumber($('#ticket-donation').val()));

    getContractBytecode(function(error, bytecode) {
      if (error !== null) {
        alert("Failed to get contract bytecode: ", error);
      } else {
        estimateGas(bytecode, function(error, estimatedGas) {
          var infos = {
            data: bytecode,
            from: web3.eth.accounts[0],
          }

          if (error !== null) {
            console.log("failed to estimate gas");
            console.log(error);
          } else {
            infos["gas"] = estimatedGas
          }

          lotteryContract.new(numberOfTickets, ticketPrice, donate, infos, function (error, result) {
            if (error) {
              console.log("Failed to deploy contract");
              console.log(error);
            } else {
              console.log("Contract deployed!");
              if (result.address) {
                console.log("Address: " + result.address);
                showContractAddress(result.address);
              }
            }
          });
        });
      }
    });
  }
  
  $('button#create-contract').click(function() {
    deployContract();
  });
});