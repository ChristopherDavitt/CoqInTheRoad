"use client"

import {
  Flex,
  Button,
  Heading,
} from '@chakra-ui/react';
import logo from '../../public/chicken.png'
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Image from 'next/image';
import ConnectButton from './ConnectButton';
import { Suspense } from 'react';

export default function Navbar() {
  return (
    <header style={{ borderBottom: '1px solid', borderColor: 'rgb(200, 200, 200)', backgroundColor: 'blue.200' }}>
      <Flex
        margin="0 auto"
        paddingX={2}
        maxWidth="1000px"
        gap='1rem'
        align='center'
        justify='space-between'
      >
          <Flex align='center'>
            <Image width={80} src={logo} alt='logo' />
          </Flex>
          <Flex gap='1rem' align='center'>
            <ColorModeSwitcher />
            <Suspense fallback={<Button isLoading colorScheme="blue"></Button>}>
              <ConnectButton />
            </Suspense>
          </Flex>
        </Flex>
      </header>
  )
}