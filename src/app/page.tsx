"use client"

import { Stack, Box, Heading, HStack, Button, Divider, Flex, Text, IconButton, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputField, NumberInputStepper, useDisclosure, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import Image from 'next/image';
import MaxWidthSection from '@/components/MaxWidthSection';
import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ethers } from 'ethers';
import { coqInTheRoadABI, erc20ABI } from '@/abis';
import formatEtherValue from '@/utils/formatEther';
import Link from 'next/link';
import GameStats from '@/components/GameStats';

const carMultipliers = [1425, 2137, 3206, 4809, 7214, 10821, 16232];

export default function Home() {
  const [coqBet, setCoqBet] = React.useState(0);
  const [cars, setCar] = React.useState(1);
  const [lane, setLane] = React.useState(1);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isOpenInfo, onClose: onCloseInfo, onOpen: onOpenInfo } = useDisclosure();

  const handleCoqChange = (value: any) => {
    // Conditionals to check for max and minBets.
    setCoqBet(value);
  }

  const dispatch = useAppDispatch();

  const balance = useAppSelector((state) => state.coqBalance);
  const account = useAppSelector((state) => state.account);
  const price = useAppSelector((state) => state.coqPrice);
  const won = useAppSelector((state) => state.won);
  const coqWon = useAppSelector((state) => state.coqWon);
  const allowance = useAppSelector((state) => state.allowance);
  const loading = useAppSelector((state) => state.loading);
  const minBet = useAppSelector((state) => state.minBet);
  const treasuryBalance = useAppSelector((state) => state.treasuryBalance);

  const [listening, setListening] = React.useState(false);

  const approve = async (coqToApprove: string) => {
    if (window.ethereum && account.address && account.chainId === 43114) {
      try {
        // Connect to an Ethereum provider (e.g., Infura, Alchemy, MetaMask)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_COQ_CA!!, erc20ABI, signer);
        await contract.approve(process.env.NEXT_PUBLIC_GAME_CA, ethers.utils.parseUnits(coqToApprove));
        console.log('Approved...')
        setListening(true);
      } catch (error) {
        console.error('Error Approving Token:', error);
        throw error;

      }
    }
  }

  const playGame = async (_coqBet: string, _lane: number, _cars: number,) => {
    if (window.ethereum && account.address && account.chainId === 43114) {
      try {
        // Connect to an Ethereum provider (e.g., Infura, Alchemy, MetaMask)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, signer);
        await contract.playChicken(ethers.utils.parseUnits(_coqBet), _lane, _cars);
        dispatch({ type: 'LOADING' });
        setListening(true);
      } catch (error) {
        console.error('Error Approving Token:', error);
        throw error;
      }
    }
  }

  React.useEffect(() => {
    let coqContract: ethers.Contract;
    let gameContract: ethers.Contract;

    const setupEventListener = async () => {
      if (window.ethereum && account.address && account.chainId === 43114) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          coqContract = new ethers.Contract(process.env.NEXT_PUBLIC_COQ_CA!!, erc20ABI, signer);
          const filter = coqContract.filters.Approval(account.address);

          coqContract.on(filter, (owner, spender, value, event) => {
            // Your event handling logic
            dispatch({ type: 'UPDATE_ALLOWANCE', payload: ethers.utils.formatEther(value) });
            console.log('EVENT EMITTED');
            setListening(false);
          });
        } catch (error) {
          console.error('Error setting up event listener:', error);
        }
      }
    };

    const setupGameEventListener = async () => {
      if (window.ethereum && account.address && account.chainId === 43114) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          gameContract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, signer);
          const filter = gameContract.filters.WinnerSelected(account.address);

          gameContract.on(filter, (sender, won, coqWon) => {
            // Your event handling logic
            dispatch({ type: 'UPDATE_WON', payload: won });
            dispatch({ type: 'UPDATE_COQ_WON', payload: ethers.utils.formatEther(coqWon) });
            onOpen();
            dispatch({ type: 'FINISH_LOADING' });
            setListening(false);
            console.log('EVENT EMITTED');
          });
        } catch (error) {
          console.error('Error setting up event listener:', error);
        }
      }
    };

    setupEventListener();
    setupGameEventListener();

    return () => {
      // Cleanup the event listener when the component unmounts
      if (!listening && gameContract) {
        gameContract.removeAllListeners();
      } else if (!listening && coqContract) {
        coqContract.removeAllListeners();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]); 

  return (
    <>
      <MaxWidthSection>
        <HStack gap="1rem" align="center" flexDirection={{ base: 'column', md: 'row' }} justify="center">
          <Box flex={{ base: 1, md: 2 }} pb={{ base: 0, md: 8 }}>
            <Image width={500} height={500} src={loading ? "/tv-loading.gif" : "/animation.gif"} unoptimized alt="tv foreground" />
          </Box>
          <Stack width={"100%"}  maxWidth={400} flex={1} bg="bg" mt={8} mb='2rem' gap='0.5rem' borderRadius={6} border="solid 1px" borderColor="gray.100" padding={4}>
              <Flex  mt={4} justifyContent="space-between" align="center">
                <Heading size='md'>COQ In The Road</Heading>
                <IconButton onClick={onOpenInfo} aria-label="info" borderRadius={9999} width={8} height={8} colorScheme='blue' icon={<>i</>} size="small" />
              </Flex>
              <Link href={`https://snowtrace.io/address/${process.env.NEXT_PUBLIC_GAME_CA}/contract/43114/code`}>
                <Text my={1} fontSize="x-small">
                  <em>CA: {process.env.NEXT_PUBLIC_GAME_CA}</em>
                </Text>
              </Link>
              <Divider />
              {/* Cars */}
              <Flex width="100%" align='center' justify='space-between'>
                <Heading flex={1} size='sm'>Cars</Heading>
                <HStack flex={2} spacing={1} align='center' justify='center'>
                  <IconButton size='sm' boxShadow='sm' 
                    borderRadius='lg' aria-label='subtract' 
                    icon={<FaMinus width={3} height={3} />} onClick={cars > 1 ? () => setCar(cars - 1) : undefined}
                  />
                  <Text>{String(cars)}</Text>
                  <IconButton size='sm' boxShadow='sm' 
                    borderRadius='lg' aria-label='add' 
                    icon={<FaPlus width={3} height={3} />} onClick={cars < 7 ? () => setCar(cars + 1) : undefined} 
                  />
                </HStack>
                <Image src={`/${cars}.png`} alt="car number" height={64} width={64} />
              </Flex>
              <Divider />
              {/* Lane */}
              <Flex align='center' justify='space-between' gap='0.5rem'>
                <Heading flex={1} size='sm'>Lane</Heading>
                <HStack flex={2} spacing={1} align='center' justify='space-around'>
                  <IconButton isActive={lane === 1} size='sm' boxShadow='sm' 
                    borderRadius='lg' aria-label='add' 
                    icon={<>1</>} onClick={() => setLane(1)} 
                  />
                  <IconButton isActive={lane === 2} size='sm' boxShadow='sm' 
                    borderRadius='lg' aria-label='add' 
                    icon={<>2</>} onClick={() => setLane(2)} 
                  />
                  <IconButton isActive={lane === 3} size='sm' boxShadow='sm' 
                    borderRadius='lg' aria-label='add' 
                    icon={<>3</>} onClick={() => setLane(3)} 
                  />
                </HStack>
                <Image src={`/lane${lane}.png`} alt="lane number" height={64} width={64} />
              </Flex>
              <Divider />
              <Flex justifyContent="space-between" width="100%" align="center">
                <Text fontSize="small" color="text" overflow="hidden">Balance: <em>{formatEtherValue(balance)}</em></Text>
                <Button py={0} size="sm" alignSelf="flex-end" onClick={() => setCoqBet((Number(treasuryBalance) / 20 / carMultipliers[cars - 1] * 1000))}>max</Button>
              </Flex>
              <NumberInput
                size='lg'
                defaultValue={10000000}
                min={10000000}
                value={coqBet}
                step={1000000}
                onChange={handleCoqChange}
              >
                <NumberInputField 
                  background="default" 
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {/* Could fetch spot price in Trader Joe... to make ~$10.96 */}
              <Text fontSize="small" color="text"><em>~ ${(Number(ethers.utils.formatEther(price)) * coqBet).toFixed(2)}</em></Text>
            {Number(allowance) > 100000000 ?
              <Button mt={2} isLoading={loading} isDisabled={loading || coqBet > Number(balance) || coqBet < Number(minBet) || (coqBet * carMultipliers[cars - 1] / 1000) > (Number(treasuryBalance) / 20)} onClick={() => playGame(String(coqBet), lane, cars)}>
                Play Game
              </Button>
            : <Button isDisabled={!account.address} mt={2} onClick={() => approve('100000000000')}>Approve</Button>}
          </Stack>
        </HStack>
        {/* <Button onClick={() => fundTreasury()}>FUND TREASURY</Button> */}
      </MaxWidthSection>
      <MaxWidthSection>
        <GameStats />
      </MaxWidthSection>
      {isOpen ? 
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Stack align="center" justify="center">
                <Image src={won ? "/survive.gif" : "death.gif"} unoptimized alt="tv" width={300} height={300} />
                <Heading>You {won === true ? 'Won!!!' : 'Lost'}</Heading>
                <Text>Total Payout: {coqWon} COQ</Text>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      : null}
      {isOpenInfo ? 
        <Modal isOpen={isOpenInfo} onClose={onCloseInfo}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Stack align="center" textAlign="left" justify="center">
                <Box mt={8}>
                    <Heading>Bet on your COQ</Heading>
                  <Text>Pick a lane, and send cars towards your COQ.</Text>
                  <Text>The more cars you send, the higher the rewards, the more dangerous it becomes.</Text>
                  <Flex my={2} align="center" justify="space-between">
                    <Heading>Cars</Heading>
                    <Image src="/7.png" alt="cars" width={48} height={48} />
                  </Flex>
                  <Text>Send between 1 - 7 cars towards your COQ. for each car sent there is a 1/3 chance your COQ gets hit, so beware!!</Text>
                  <Flex my={2} align="center" justify="space-between">
                    <Heading>Lane</Heading>
                    <Image src="/lane2.png" alt="lane" width={48} height={48} />
                  </Flex>
                  <Text>Pick a lane for your COQ to stay in and pray the cars dodge you!</Text>
                  <Heading my={2}>Rewards and Outcome</Heading>
                  <Text mb={8}>Rewards are proportional to the risk. 5% goes to the house.</Text>
                </Box>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      : null}
    </>
  )
}
