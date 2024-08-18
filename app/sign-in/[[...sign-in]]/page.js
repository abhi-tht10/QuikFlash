import { AppBar, Container, Button, Toolbar, Typography, Box } from '@mui/material';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Box
      width="100vw"
      minHeight="100vh"
      style={{ background: "linear-gradient(0deg, rgba(22,22,29,1) 0%, rgba(10,9,19,1) 73%)" }}
      display="flex"
      flexDirection="column"
    >
      <AppBar position="static" sx={{ backgroundColor: "rgba(22,22,29,1)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            QuikFlash
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Login
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign Up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            mt: 4,
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <SignIn />
        </Box>
      </Container>
    </Box>
  );
}