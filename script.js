// Function to generate random Transaction ID (#TXN + 8 digits)
function generateTxnId() {
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return `#TXN${digits}`;
}

// Function to generate random Reference Number (REF– + 10 digits)
function generateRefNumber() {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `REF–${digits}`;
}

// Store receipt data for tracking (simulated storage)
const receiptStorage = new Map();

// Handle form submission
document.getElementById('receiptForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page refresh

  // Get form input values
  const txnDate = document.getElementById('txnDate').value;
  const transferAmount = document.getElementById('transferAmount').value;
  const transferFrom = document.getElementById('transferFrom').value;
  const transferTo = document.getElementById('transferTo').value;
  const recipientCountry = document.getElementById('recipientCountry').value.split('|');
  const countryName = recipientCountry[0];
  const countryFlag = recipientCountry[1];
  const transferMessage = document.getElementById('transferMessage').value;
  const processingDate = document.getElementById('processingDate').value;
  const expectedCompletion = document.getElementById('expectedCompletion').value;
  const transferFee = document.getElementById('transferFee').value;
  const feePercentage = document.getElementById('feePercentage').value;

  // Generate IDs
  const txnId = generateTxnId();
  const referenceNumber = generateRefNumber();

  // Update receipt fields
  document.getElementById('txnIdDisplay').textContent = txnId;
  document.getElementById('txnDateDisplay').textContent = txnDate;
  document.getElementById('transferAmountDisplay').textContent = transferAmount;
  document.getElementById('transferFromDisplay').textContent = transferFrom;
  document.getElementById('transferToDisplay').textContent = transferTo;
  document.getElementById('transferToDisplay2').textContent = transferTo;
  document.getElementById('recipientCountryDisplay').textContent = `${countryFlag} ${countryName}`;
  document.getElementById('transferMessageDisplay').textContent = `Your payment is on hold. You need to make a payment of ${transferFee}.`;
  document.getElementById('transferMessageDisplay2').textContent = `"${transferMessage}"`;
  document.getElementById('processingDateDisplay').textContent = processingDate;
  document.getElementById('expectedCompletionDisplay').textContent = expectedCompletion;
  document.getElementById('transferFeeDisplay').textContent = transferFee;
  document.getElementById('feePercentageDisplay').textContent = feePercentage;
  document.getElementById('referenceNumberDisplay').textContent = referenceNumber;

  // Store receipt data for tracking
  const receiptData = {
    txnId,
    txnDate,
    transferAmount,
    transferFrom,
    transferTo,
    countryName,
    countryFlag,
    transferMessage,
    processingDate,
    expectedCompletion,
    transferFee,
    feePercentage,
    referenceNumber
  };
  receiptStorage.set(referenceNumber, receiptData);
});

// Handle Share button
document.getElementById('shareButton').addEventListener('click', function() {
  const referenceNumber = document.getElementById('referenceNumberDisplay').textContent;
  const shareUrl = `${window.location.origin}/track.html?ref=${encodeURIComponent(referenceNumber)}`;

  // Try Web Share API
  if (navigator.share) {
    navigator.share({
      title: 'Coinbase Transfer Receipt',
      text: 'Track your transfer receipt from Coinbase.',
      url: shareUrl
    }).catch(err => console.error('Share failed:', err));
  } else {
    // Fallback: Copy link to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Tracking link copied to clipboard: ' + shareUrl);
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Please copy this link manually: ' + shareUrl);
    });
  }
});

// Handle tracking page (if URL has ref parameter)
if (window.location.pathname.includes('track.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref && receiptStorage.has(ref)) {
    const data = receiptStorage.get(ref);
    // Update receipt with stored data
    document.getElementById('txnIdDisplay').textContent = data.txnId;
    document.getElementById('txnDateDisplay').textContent = data.txnDate;
    document.getElementById('transferAmountDisplay').textContent = data.transferAmount;
    document.getElementById('transferFromDisplay').textContent = data.transferFrom;
    document.getElementById('transferToDisplay').textContent = data.transferTo;
    document.getElementById('transferToDisplay2').textContent = data.transferTo;
    document.getElementById('recipientCountryDisplay').textContent = `${data.countryFlag} ${data.countryName}`;
    document.getElementById('transferMessageDisplay').textContent = `Your payment is on hold. You need to make a payment of ${data.transferFee}.`;
    document.getElementById('transferMessageDisplay2').textContent = `"${data.transferMessage}"`;
    document.getElementById('processingDateDisplay').textContent = data.processingDate;
    document.getElementById('expectedCompletionDisplay').textContent = data.expectedCompletion;
    document.getElementById('transferFeeDisplay').textContent = data.transferFee;
    document.getElementById('feePercentageDisplay').textContent = data.feePercentage;
    document.getElementById('referenceNumberDisplay').textContent = data.referenceNumber;
  } else {
    document.querySelector('.receipt-container').innerHTML = '<p>Invalid or missing reference number.</p>';
  }
}
