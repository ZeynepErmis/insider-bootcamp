// Function to calculate the Collatz sequence length for a given number n
function collatzLength(n) {
  let length = 1; // Initialize the length of the sequence with 1 (including the starting number)
  while (n !== 1) {
    // Continue the sequence until n becomes 1
    n = n % 2 === 0 ? n / 2 : 3 * n + 1; // If n is even, divide by 2; if odd, apply 3n + 1 rule
    length++; // Increase the sequence length
  }
  return length; // Return the total length of the sequence
}

// Function to find the number under 'limit' that produces the longest Collatz sequence
function longestCollatz(limit) {
  let maxLength = 0; // Store the maximum sequence length found so far
  let maxNumber = 0; // Store the number that generates the longest sequence

  for (let i = 1; i < limit; i++) {
    // Iterate through all numbers from 1 to 'limit - 1'
    let length = collatzLength(i); // Compute the Collatz sequence length for the current number
    if (length > maxLength) {
      // If a longer sequence is found, update the records
      maxLength = length; // Update the longest sequence length
      maxNumber = i; // Update the number that produces the longest sequence
    }
  }

  return maxNumber; // Return the number that generates the longest Collatz sequence
}

console.log(longestCollatz(1000000)); // Find and print the number under 1,000,000 with the longest Collatz sequence
