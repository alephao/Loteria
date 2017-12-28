Loteria v1.0.0
---

**Loteria** is a simple platform to generate lottery contracts on Ethereum.

### How it works
A Loteria has a fixed number of tickets available to buy, and a ticket price. When all lottery tickets are sold, one of the tickets is selected randomly, and the ticket owner will get all the money stored in the contract.

### The Loteria Contract
**Constructor**

The Loteria contract constructor takes three parameters

* `uint numberOfTickets` the number of tickets available to buy
* `uint ticketPrice` The ticket price in `wei`
* `uint donation` a % of the total prize you want to donate to me. Has to be an integer value from 0 to 100

The address that created the contract, is the lottery owner. The lottery owner will have these methods available:
* `endLottery()`: This will select a winner randomnly
* `cancelLottery()` the lottery: Everyone who bought a ticket will get the money back

**Joining a Lottery**

Anyone can join any lottery by calling `buyTicket()` while sending the `ticketPrice` amount to the contract. *Make sure the lottery is still available before joining*

**Constants**
* `getTicketPrice() uint` returns the contract's `ticketPrice`
* `getNumberOfTickets() uint` returns the contract's `numberOfTickets`
* `getNumberOfTicketsSold() uint` returns the contract's `numberOfTicketsSold`
* `lotteryIsOver() bool` returns `true` if lottery is no longer availabe, returns `false` if lottery is still available


**If a lottery is over, the contract become useless, but it will not be destroyed**