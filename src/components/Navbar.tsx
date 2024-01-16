"use client"

import {
  Flex,
  Button,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import logo from '../../public/chicken.png'
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Image from 'next/image';
import ConnectButton from './ConnectButton';
import { Suspense } from 'react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { usePathname } from 'next/navigation';
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';
import useIsMobile from './useIsMobile';

function HamburgerMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <IconButton aria-label="open menu" icon={<HamburgerIcon />} onClick={onOpen} />
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Stack textAlign="center" gap={4}>
              <Link
                onClick={onClose}
                href='/'
              >
                Home
              </Link>
              <Link
                onClick={onClose}
                href='/whitepaper'
              >
                Whitepaper
              </Link>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default function Navbar() {
  const path = usePathname();
  const isMobile = useIsMobile();
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
            {!isMobile ?
              <>
                <Link href='/'
                >
                  <Button
                    style={path === '/' ? { fontWeight: 'bold' } : {}}
                    variant="ghost"
                  >
                    Home
                  </Button>
                </Link>
                <Link
                  href='/whitepaper'
                >
                  <Button variant="ghost" style={path === '/whitepaper' ? { fontWeight: 'bold' } : {}}>
                      Whitepaper
                  </Button>
                </Link>
              </> 
            : null}
          </Flex>
          <Flex gap='1rem' align='center'>
            <ColorModeSwitcher />
            <Suspense fallback={<Button isLoading colorScheme="blue"></Button>}>
              <ConnectButton />
            </Suspense>
            {isMobile ? <HamburgerMenu /> : null}
          </Flex>
        </Flex>
      </header>
  )
}