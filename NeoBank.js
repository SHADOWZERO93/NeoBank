const contractAddress = "0xa113f7030549D0E044709F455554c4b96E9B7dd7"; // Your contract address
const contractABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

let account = null;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      account = accounts[0];
      document.getElementById("wallet-status").innerText = `Connected: ${account}`;
      alert("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Error connecting to MetaMask.");
    }
  } else {
    alert("MetaMask not detected.");
  }
}

async function fetchBalance() {
  if (!window.ethereum) return alert("MetaMask is required!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  try {
    const balance = await contract.getBalance();
    document.getElementById("balance").innerText = `${ethers.utils.formatEther(balance)} ETH`;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

async function handleDeposit() {
  const amount = document.getElementById("amount").value;
  if (!amount || !account) return alert("Enter amount and connect wallet!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    fetchBalance();
    alert("Deposit successful!");
  } catch (error) {
    console.error("Deposit failed:", error);
    alert("Deposit failed.");
  }
}

async function handleWithdraw() {
  const amount = document.getElementById("amount").value;
  if (!amount || !account) return alert("Enter amount and connect wallet!");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    const tx = await contract.withdraw(ethers.utils.parseEther(amount));
    await tx.wait();
    fetchBalance();
    alert("Withdrawal successful!");
  } catch (error) {
    console.error("Withdrawal failed:", error);
    alert("Withdrawal failed.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".connect-wallet").addEventListener("click", connectWallet);
  document.querySelector(".deposit").addEventListener("click", handleDeposit);
  document.querySelector(".withdraw").addEventListener("click", handleWithdraw);
  fetchBalance();
});