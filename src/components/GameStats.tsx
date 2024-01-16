import { useEffect, useState } from 'react';
import { Box, List, ListItem, Text } from '@chakra-ui/react';
import { useAppSelector } from '@/lib/hooks';
import { ethers } from 'ethers';
import { coqInTheRoadABI } from '@/abis';

const GameStats = () => {
  const [games, setGames] = useState<any[]>([]);

  const account = useAppSelector((state) => state.account);
  
  useEffect(() => {
    fetchGames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const fetchGames = async () => {
    if (window.ethereum && account.address && account.chainId === 43114) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gameContract = new ethers.Contract(process.env.NEXT_PUBLIC_GAME_CA!!, coqInTheRoadABI, provider);
        const gameId: number = gameContract.currentGameId().then((data: any) => ethers.utils.parseUnits(data, 0));

        let gamesToFetch = gameId > 10 ? 10 : gameId;
        let fetchedGames = [];

        console.log(gamesToFetch)
        for (let i = gameId - gamesToFetch + 1; i <= gameId; i++) {
          const gameDetails = await gameContract.gameById(i);
          fetchedGames.push({
            gameId: i,
            sender: gameDetails.sender,
            coqBet: ethers.utils.formatEther(gameDetails.coqBet),
            carAmount: gameDetails.carAmount,
            laneNumber: gameDetails.laneNumber,
            completed: gameDetails.completed,
            won: gameDetails.won
          });
        }

        setGames(fetchedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }
  };

  return (
    <Box>
      <Text fontSize="xl" mb="4">Recent Games</Text>
      <List>
        {games.slice(0, 10).map((game, index) => (
          <ListItem key={index} p="2" borderBottom="1px" borderColor="gray.200">
            {/* Display your game data here */}
            <Text>Game ID: {game.gameId}</Text>
            <Text>Sender: {game.sender}</Text>
            {/* Add more game details as needed */}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default GameStats;