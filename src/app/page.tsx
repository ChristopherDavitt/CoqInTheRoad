"use client"

import { Stack, Box, Heading, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import MaxWidthSection from '@/components/MaxWidthSection';

export default function Home() {
  return (
    <>
      <MaxWidthSection>
        
        <HStack>
            <Box flex={2}>
                <Image width={500} height={500} src="/tv.png" alt="tv foreground" />
            </Box>
            <Stack>
                <Heading>
                    Lane
                </Heading>
            </Stack>
        </HStack>
      </MaxWidthSection>
    </>
  )
}
