
function submitPayment() {
  const txnId = document.getElementById("txnId").value.trim();
  if (!txnId) {
    alert("Please enter your UPI Transaction ID.");
    return;
  }
  document.getElementById("popup").style.display = "block";
}
