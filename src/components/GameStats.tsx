import { useEffect, useState } from 'react';
import { 
  Box,
  List,
  ListItem,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
} from '@chakra-ui/react';
import { useAppSelector } from '@/lib/hooks';
import { ethers } from 'ethers';
import { coqInTheRoadABI } from '@/abis';
import truncateEthAddress from '@/utils/truncateWallet';
import formatEtherValue from '@/utils/formatEther';

const carMultipliers = [1425, 2137, 3206, 4809, 7214, 10821, 16232];

type Game = {
  gameId: number | any;
  sender: string | any;
  coqBet: string | any;
  carAmount: string | any;
  laneNumber: string | any;
  completed: boolean | any;
  won: boolean | any;
}

const GameStats = () => {
  const [games, setGames] = useState<Game[]>([]);

  const account = useAppSelector((state) => state.account);
  
  useEffect(() => {
    fetchGames();
    let gameContract: ethers.Contract;

    const setupGameEventListener = async () => {
      if (window.ethereum && account.address && account.chainId === 43113) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          gameContract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, signer);
          const filter = gameContract.filters.GameStarted(account.address);

          gameContract.on(filter, (sender, requestId, laneNumber, carAmount, coqBet) => {
            // Your event handling logic
            fetchGames();
            console.log('EVENT EMITTED');
          });
        } catch (error) {
          console.error('Error setting up event listener:', error);
        }
      }
    };

    setupGameEventListener();

    return () => {
      // Cleanup the event listener when the component unmounts
      if (gameContract) {
        gameContract.removeAllListeners();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const fetchGames = async () => {
    if (window.ethereum && account.address && account.chainId === 43113) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gameContract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, provider);
        const gameId = await gameContract.currentGameId();
        console.log(`Game Id hex: ${gameId}`)

        let gamesToFetch = gameId > 10 ? 10 : gameId;
        let fetchedGames = [];

        console.log(gamesToFetch)
        for (let i = gameId - gamesToFetch + 1; i <= gameId; i++) {
          const gameDetails = await gameContract.gameById(i);
          fetchedGames.push({
            gameId: i,
            sender: gameDetails.sender,
            coqBet: ethers.utils.formatEther(gameDetails.coqBet),
            carAmount: parseInt(gameDetails.carAmount._hex, 16),
            laneNumber: parseInt(gameDetails.laneNumber._hex, 16),
            completed: gameDetails.completed,
            won: gameDetails.won
          });
        }
        console.log(fetchedGames);

        setGames(fetchedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }
  };

  return (
    <Box>
      <Text fontSize="xl" mb="4">Recent Games</Text>
      <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th>Game ID</Th>
              <Th>Address</Th>
              <Th>Status</Th>
              <Th isNumeric>Car #</Th>
              <Th isNumeric>Lane #</Th>
              <Th isNumeric>$COQ Bet</Th>
              <Th isNumeric>Payout</Th>
            </Tr>
          </Thead>
          <Tbody>
            {games.map((e, i) => {
              return (
                <Tr key={i}>
                  <Td>{e.gameId}</Td>
                  <Td>{truncateEthAddress(e.sender)}</Td>
                  <Td color={e.completed === false ? 'yellow.500' : 'initial'}>{e.completed === false ? 'Pending' : e.won ? 'Won': 'Lost'}</Td>
                  <Td isNumeric>{e.carAmount}</Td>
                  <Td isNumeric>{e.laneNumber}</Td>
                  <Td isNumeric>{formatEtherValue(e.coqBet)}</Td>
                  <Td isNumeric fontWeight={e.won ? 700 : 500} color={e.won ? 'green.500' : 'initial'}>{e.completed === false ? '0' : e.won ? formatEtherValue(`${Number(e.coqBet) * carMultipliers[Number(e.carAmount) - 1] / 1000}`) : 0}</Td>
                </Tr>  
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {games.length < 1 ? <Center my={4}>No games played...</Center> : null}
    </Box>
  );
};

export default GameStats;