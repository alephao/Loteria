$(function() {
  var etherInWei = new BigNumber(1000000000000000000);

  if (typeof web3 !== undefined) {
    web3 = new Web3(web3.currentProvider);
  } else {
    // Something asking to use metamask
    console.log('no web3');
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  var abi = [{"constant":false,"inputs":[],"name":"cancelLottery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTicketPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfTickets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfTicketsSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buyTicket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"lotteryIsOver","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_numberOfTickets","type":"uint256"},{"name":"_ticketPrice","type":"uint256"},{"name":"_donate","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
  var lotteryContract = web3.eth.contract(abi);
  
  function getContractBytecode(numberOfTickets, ticketPrice, donate, callback) {
    $.get('./solcoutput/TicketLotteryGame.bin', function(data, a, b) {
      var bytecode = '0x' + data;
      callback(bytecode);
    });
  }

  function deployContract() {    
    var numberOfTickets = new BigNumber($('#number-of-tickets').val());
    var ticketPrice = (new BigNumber($('#ticket-price').val())).times(etherInWei);
    var donate = 'true';

    getContractBytecode(numberOfTickets, ticketPrice, donate, function(bytecode) {
      web3.eth.estimateGas({data: bytecode}, function (error, gasEstimate) {
        lotteryContract.new(numberOfTickets, ticketPrice, donate, {
          data: bytecode, 
          from:web3.eth.accounts[0],
          gas:gasEstimate }, function (error, result) {
          if (error) {
            console.log("ERRO DEPLOYANDO");
            console.log(error);
          } else {
            console.log("SEM ERRO DEPLOYANDO");
            if (result.address) {
              console.log("ADDRESS " + result.address);
              var contract_instance = result;
              console.log(contract_instance);
            }
          }
        });
      });
    });
  }

  function findLottery() {
    var address = $('#lottery-address').val();
    var contract = lotteryContract.at(address);
    contract.getNumberOfTickets(function(error, result) {
      if (error) {
        console.log(error);
      } else if (result) {
        var val = result.toString(10);
        $('#total-lottery-tickets').text(val);
      } else {
        console.log('No error, no result on getNumberOfTickets');
      }
    });

    contract.getNumberOfTicketsSold(function(error, result) {
      if (error) {
        console.log(error);
      } else if (result) {
        var val = result.toString(10);
        $('#sold-lottery-tickets').text(val);
      } else {
        console.log('No error, no result on getNumberOfTicketsSold');
      }
    });

    contract.getTicketPrice(function(error, result) {
      if (error) {
        console.log(error);
      } else if (result) {
        var ticketPrice = (new BigNumber(result.toString(10))).dividedBy(etherInWei).toString(10);
        $('#lottery-price').text(ticketPrice + ' ETH');
      } else {
        console.log('No error, no result on getTicketPrice');
      }
    });

    contract.lotteryIsOver(function(error, result) {
      if (error) {
        console.log(error);
      } else if (result != undefined) {
        if (result) {
          $('#lottery-notice').show();
        } else {
          $('#lottery-notice').hide();
        }
      } else {
        console.log('No error, no result on lotteryIsOver');
      }
    });
  }
  
  $('#create-lottery').click(function() {
    deployContract();
  });

  $('#find-lottery').click(function() {
    findLottery();
  });
});