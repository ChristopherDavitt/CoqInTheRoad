export default function truncateEthAddress(address: string, length: number = 6): string {
  // Check if the address is shorter than the expected length for an Ethereum address
  if (address.length < 2 + length * 2) {
    throw new Error("Address too short to truncate");
  }

  // Check for '0x' prefix
  if (address.substring(0, 2) !== '0x') {
    throw new Error("Invalid Ethereum address");
  }

  return `${address.substring(0, 2 + length)}...${address.substring(address.length - length)}`;
}