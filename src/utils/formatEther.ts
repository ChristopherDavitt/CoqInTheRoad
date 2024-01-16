import { ethers } from "ethers";

function formatEtherValue(etherString: string) {
    // Convert the ether string to a BigNumber
    const etherAmount = ethers.utils.parseEther(etherString);

    // Define thresholds
    const billion = ethers.utils.parseUnits("1", 27); // 1 billion wei
    const million = ethers.utils.parseUnits("1", 24); // 1 million wei

    // Format the value
    if (etherAmount.gte(billion)) {
        // If it's in billions, convert to billions and fix to 2 decimal places
        return `${ethers.utils.formatUnits(etherAmount, 27).slice(0, 5)}B`;
    } else if (etherAmount.gte(million)) {
        // If it's in millions, convert to millions without decimals
        return `${ethers.utils.formatUnits(etherAmount, 24)}M`;
    } else {
        // For less than a million, just show in ether
        return ethers.utils.formatEther(etherAmount);
    }
}
export default formatEtherValue;
