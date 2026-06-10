export function convertNumberToWords(num) {
  if (num === null || num === undefined || isNaN(num)) return "";

  // Convert to integer part
  let amount = Math.floor(num);
  if (amount === 0) return "Zero Rupees Only.";

  const singleDigits = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const doubleDigits = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function helper(n) {
    if (n < 20) return singleDigits[n];
    if (n < 100) return doubleDigits[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + singleDigits[n % 10] : "");
    if (n < 1000) return singleDigits[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + helper(n % 100) : "");
    return "";
  }

  let words = "";

  // Crores
  if (Math.floor(amount / 10000000) > 0) {
    words += helper(Math.floor(amount / 10000000)) + " Crore ";
    amount %= 10000000;
  }

  // Lakhs
  if (Math.floor(amount / 100000) > 0) {
    words += helper(Math.floor(amount / 100000)) + " Lakh ";
    amount %= 100000;
  }

  // Thousands
  if (Math.floor(amount / 1000) > 0) {
    words += helper(Math.floor(amount / 1000)) + " Thousand ";
    amount %= 1000;
  }

  // Hundreds & Tens/Ones
  if (amount > 0) {
    words += helper(amount);
  }

  return words.trim() ? words.trim() + " Only." : "";
}
