let selectedCard = null;
let selectedAction = null;

document.addEventListener("DOMContentLoaded", () => {
    const fingerprintInput = document.getElementById('fingerprint');
    const authenticateBtn = document.getElementById('authenticate');
    const checkBalanceBtn = document.getElementById('check-balance');
    const withdrawBtn = document.getElementById('withdraw');
    const depositBtn = document.getElementById('deposit');
    const confirmPinBtn = document.getElementById('confirm-pin');
    const confirmAmountBtn = document.getElementById('confirm-amount');
    const terminateBtn = document.getElementById('terminate-transaction');

    if (authenticateBtn) {
        authenticateBtn.addEventListener('click', async () => {
            const fingerprintHash = fingerprintInput.value.trim();

            if (!fingerprintHash) {
                alert("Please enter a fingerprint hash!");
                return;
            }

            try {
                const response = await fetch('/authenticate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fingerprint_hash: fingerprintHash })
                });

                const data = await response.json();

                if (data.success) {
                    document.getElementById('auth-section').style.display = 'none';
                    const cardList = document.getElementById('cards-list');
                    cardList.innerHTML = "";
                    document.getElementById('card-selection').style.display = 'block';

                    data.cards.forEach(card => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `Card Number: ${card.card_number}`;
                        listItem.addEventListener('click', () => {
                            selectedCard = card;
                            document.getElementById('card-selection').style.display = 'none';
                            document.getElementById('transaction-options').style.display = 'block';
                        });
                        cardList.appendChild(listItem);
                    });
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Authentication error:", error);
            }
        });
    }

    if (checkBalanceBtn) {
        checkBalanceBtn.addEventListener('click', () => {
            selectedAction = 'check_balance';
            document.getElementById('transaction-options').style.display = 'none';
            document.getElementById('pin-section').style.display = 'block';
        });
    }

    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => {
            selectedAction = 'withdraw';
            document.getElementById('transaction-options').style.display = 'none';
            document.getElementById('amount-section').style.display = 'block';
        });
    }

    if (depositBtn) {
        depositBtn.addEventListener('click', () => {
            selectedAction = 'deposit';
            document.getElementById('transaction-options').style.display = 'none';
            document.getElementById('amount-section').style.display = 'block';
        });
    }

    if (confirmAmountBtn) {
        confirmAmountBtn.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('amount').value);
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            document.getElementById('amount-section').style.display = 'none';
            document.getElementById('pin-section').style.display = 'block';
        });
    }

    if (confirmPinBtn) {
        confirmPinBtn.addEventListener('click', async () => {
            const pin = document.getElementById('pin').value.trim();
            const amount = (selectedAction === 'withdraw' || selectedAction === 'deposit')
                ? parseFloat(document.getElementById('amount').value)
                : 0;

            if (!pin || pin.length !== 4 || isNaN(parseInt(pin))) {
                alert("Please enter a valid 4-digit PIN.");
                return;
            }

            try {
                const response = await fetch('/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        card_id: selectedCard.card_id,
                        pin,
                        action: selectedAction,
                        amount
                    })
                });

                const data = await response.json();
                document.getElementById('pin-section').style.display = 'none';

                if (data.success) {
                    if (selectedAction === 'check_balance') {
                        document.getElementById('balance-display').textContent = `Balance: ₹${data.balance}`;
                        document.getElementById('balance-section').style.display = 'block';
                        document.getElementById('cancel-section').style.display = 'block';
                    } else {
                        alert(`${selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)} Successful! ₹${amount} processed.`);
                        resetState();
                    }
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error("Transaction error:", err);
                alert("Transaction failed.");
            }
        });
    }

    if (terminateBtn) {
        terminateBtn.addEventListener('click', () => {
            fetch('/terminate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    resetState();
                }
            })
            .catch(err => {
                console.error("Terminate error:", err);
            });
        });
    }

    function resetState() {
        selectedCard = null;
        selectedAction = null;

        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('card-selection').style.display = 'none';
        document.getElementById('transaction-options').style.display = 'none';
        document.getElementById('pin-section').style.display = 'none';
        document.getElementById('amount-section').style.display = 'none';
        document.getElementById('balance-section').style.display = 'none';
        document.getElementById('cancel-section').style.display = 'none';

        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => input.value = "");
    }
});
