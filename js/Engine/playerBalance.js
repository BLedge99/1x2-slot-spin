export class PlayerBalance {
    #balance;  
    constructor(initialBalance) {
        this.#balance = initialBalance;
    }

    getBalance() {
        return this.#balance;
    }

    updateBalance(amount) {
        this.#balance += amount;
    }
}