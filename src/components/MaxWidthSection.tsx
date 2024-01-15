import { Box } from '@chakra-ui/react';

const MaxWidthSection = ({ bg, children }: { children: React.ReactNode, bg?: string }) => {
    const sectionStyle = {
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '1em',
    };

    return (
      <Box as="section" backgroundColor={bg} >
        <div style={sectionStyle}>
          {children}
        </div>
      </Box>
    );
};

export default MaxWidthSection;