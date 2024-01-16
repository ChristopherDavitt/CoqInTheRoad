/* eslint-disable react/jsx-no-comment-textnodes */
import MaxWidthSection from '@/components/MaxWidthSection'
import { Stack, Heading, Text, Box, Flex, Code } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function WhitePaper() {
  return (
    <MaxWidthSection>
      <Stack spacing={4}>
        <Heading size="xl">Whitepaper</Heading>
        <Text>What happened when the COQ crossed the road???</Text>
        <Heading>TLDR</Heading>
        <Text maxWidth={800}>Bet $COQ on your chicken to cross the road safely. Send between 1 - 7 cars and pick a lane to avoid the cars.</Text>
        <Heading>Project Overview</Heading>
        <Heading size="md">Game Mechanics</Heading>
        <Text>Pick a lane, and send cars towards your COQ.</Text>
        <Text>The more cars you send, the higher the rewards, the more dangerous it becomes.</Text>
        <Flex gap={4} maxWidth={800} align="center">
          <Heading size="md">Cars</Heading>
          <Image src="/7.png" alt="cars" width={48} height={48} />
        </Flex>
        <Text>Send between 1 - 7 cars towards your COQ. for each car sent there is a 1/3 chance your COQ gets hit, so beware!!</Text>
        <Flex gap={4} maxWidth={800} align="center">
          <Heading size="md">Lane</Heading>
          <Image src="/lane2.png" alt="lane" width={64} height={64} />
        </Flex>
        <Text>Pick a lane for your COQ to stay in and pray the cars dodge you!</Text>
        <Heading size="md">Rewards and Outcome</Heading>
        <Text>Rewards are proportional to the risk. 5% goes to the house.</Text>
        <Code borderRadius="8" maxWidth={600}>
          // Prize multipliers for the cars.
          <br />
          uint256[] carMultipliers = [1425, 2137, 3206, 4809, 7214, 10821, 16232];
          <br />
          <br />
          // Probability of not getting flattened by a car.
          <br />
          uint256[] carProbabilities = [667, 444, 296, 198, 132, 88, 59];
        </Code>
        <Heading>House Treasury</Heading>
        <Text maxWidth={800}>The house treasury acts as a burn mechanism for COQ. Only funds that have been added can be withdrawn. All <em>profits</em> made from the house cannot be withdrawn.</Text>
        <Text maxW={800}>Initital fund is made by the contract owner, and is locked for 30 days. All winnings from the COQathon will go to fund the treasury.</Text>
        <Text>House cut is 5%</Text>
        
        <Heading>Max and Min Bets</Heading>
        <Text>Min Bet is set initially to 10M $COQ (~$15.00) to cover LINK costs for the random number generator.</Text>
        <Text>Max Bet is set to not allow potential profit to exceed <Code>treasuryBalance() / 20</Code></Text>
        <Text>This is to reduce variance, and allow the treasury balance to increase steadily</Text>
        <Heading>Result</Heading>
        <Text>You either survive or die. COQ is payed out to winners.</Text>
        <Text>Payout: <Code>coqBet * carMultipliers[carNumber - 1] / 1000</Code></Text>
        <Stack flexDirection={{ base: 'column', md: 'row' }}>
          <Image src={"/survive.gif"} unoptimized alt="tv" width={300} height={300} />
          <Image src={"/death.gif"} unoptimized alt="tv" width={300} height={300} />
        </Stack>
        <Heading>Additional Comments and Resources</Heading>
        <Link href={`https://snowtrace.io/address/${process.env.NEXT_PUBLIC_GAME_CA}/contract/43114/code`}>
          <Text>CA: <em>{process.env.NEXT_PUBLIC_GAME_CA}</em></Text>
        </Link>
        <Text>In the case where Chainlink doesnt fulfill randomness, requestIds will be mapped to the user address, so we can keep track and fulfill those requests.</Text>
      </Stack>
    
    </MaxWidthSection>
  )
}
