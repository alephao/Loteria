$(function() {
  var etherInWei = new BigNumber(1000000000000000000);

  if (typeof web3 !== undefined) {
    web3 = new Web3(web3.currentProvider);
  } else {
    alert("You need metamask to use this website");
  }

  var abi = [{"constant":true,"inputs":[],"name":"getTicketPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"getNumberOfTickets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"getNumberOfTicketsSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[],"name":"buyTicket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},
  {"constant":true,"inputs":[],"name":"lotteryIsOver","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}];
  var lotteryContract = web3.eth.contract(abi);

  var currentLottery = null;

  function findContract(address, callback) {
    var contract = lotteryContract.at(address);
    if (contract) {
      callback(null, contract);
    } else {
      callback("Couldn't find contract", null);
    }
  }
  
  $('button#search-button').click(function() {
    var contractAddress = $('input#contract-address').val()
    findContract(contractAddress, function(error, contract) {
      if (error) {
        console.error(error);
        alert(error);
      } else if (contract) {
        $('#findLottery').modal();
        currentLottery = {"contract": contract}
        contract.getNumberOfTickets(function(error, result) {
          if (error) {
            console.log(error);
          } else if (result) {
            var val = result.toString(10);
            currentLottery["numberOfTickets"] = val;
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
            currentLottery["numberOfTicketsSold"] = val;
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
            currentLottery["ticketPrice"] = result.toString(10);
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
      } else {
        console.error("Something strange happened");
        alert("Something strange happened");
      }
    });
  });

  $('button#join-lottery').click(function() {
    var contractAddress = $('input#contract-address').val()
    if (currentLottery) {
      currentLottery["contract"].buyTicket({from: web3.eth.accounts[0], gas: 3000000, value: currentLottery["ticketPrice"]}, function(error, result) {
        console.log(error);
        console.log(result);
      });
    } else {
      alert("Something went wrong, please refresh the page and try again")
    }
  });
});