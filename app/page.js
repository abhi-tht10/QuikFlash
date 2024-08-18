'use client';
import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { AppBar, Container, Button, Typography, Toolbar, Box, Grid } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Head from 'next/head';
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleSubmit = async () => {
        const checkoutSession = await fetch('/api/checkout_session', {
            method: 'POST',
            headers: {
                origin: 'http://localhost:3000',
            },
        })
        const checkoutSessionJson = await checkoutSession.json()
        if (checkoutSession.statusCode === 500) {
            console.error(checkoutSession.message)
            return
        }
        const stripe = await getStripe()
        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSessionJson.id,
        })
        if (error) {
            console.warn(error.message)
        }
    }

    const handleGeneratePageClick = () => {
        router.push('/generate');
    };

    return (
        <>
            <Head>
                <title>QuikFlash</title>
                <meta name="description" content="Create flashcards from your text" />
            </Head>
            <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="space-between" style={{ background: "linear-gradient(0deg, rgba(22,22,29,1) 0%, rgba(10,9,19,1) 73%)" }}>
                <AppBar position="static" color="secondary">
                    <Container maxWidth={false}>
                        <Toolbar>
                            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>QuikFlash</Typography>
                            <SignedOut>
                                <Button color="inherit" href="sign-in" sx={{ color: 'white' }}>Login</Button>
                                <Button color="inherit" href="sign-up" sx={{ color: 'white' }}>Sign Up</Button>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center', my: 4 }}>
                        <Typography variant="h2" sx={{ color: 'white' }} gutterBottom>Welcome To QuikFlash</Typography>
                        <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleGeneratePageClick}>Get Started</Button>
                    </Box>
                    <Box sx={{ my: 6 }} textAlign={'center'}>
                        <Typography variant="h4" sx={{ color: 'white' }} gutterBottom>
                            Features
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>Easy Text Input</Typography>
                                    <Typography sx={{ color: 'white', flexGrow: 1 }}>Create flashcards in a flash with a single click. </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>Smart Flashcards</Typography>
                                    <Typography sx={{ color: 'white', flexGrow: 1 }}>Generate precise flashcards using out AI model.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h5" sx={{ color: 'white' }} gutterBottom>On The Go</Typography>
                                    <Typography sx={{ color: 'white', flexGrow: 1 }}>Access your flashcards from any device, at any time.</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ my: 6, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>Pricing</Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    borderRadius: 2,
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>Basic</Typography>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>$5 / month</Typography>
                                    <Typography sx={{ color: 'white' }}>
                                        Access to basic flashcard features and limited storage
                                    </Typography>
                                    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Basic</Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    p: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    borderRadius: 2,
                                }}>
                                    <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>Pro</Typography>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>$10 / month</Typography>
                                    <Typography sx={{ color: 'white' }}>
                                        Unlimited flashcards and storage, with priority support.
                                    </Typography>
                                    <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
                <Box component="footer" sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ color: 'white' }}>© 2024 QuikFlash. All rights reserved.</Typography>
                </Box>
            </Box>
        </>
    );
}