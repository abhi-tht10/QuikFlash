'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;

            try {
                console.log("User loaded:", user); // Debug log for user object
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    console.log("Flashcards fetched:", collections); // Debug log for fetched flashcards
                    setFlashcards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                    console.log("No flashcards found, initialized empty array"); // Debug log for empty flashcards initialization
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error); // Error log
            }
        }

        if (isLoaded && isSignedIn) {
            getFlashcards();
        }
    }, [user, isLoaded, isSignedIn]);

    if (!isLoaded || !isSignedIn) {
        return <Typography variant="h6" sx={{ color: 'white' }}>Loading...</Typography>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleHomeClick = () => {
        router.push('/');
      };

    return (
        <Box
            width="100vw"
            minHeight="100vh"
            style={{ background: "linear-gradient(0deg, rgba(22,22,29,1) 0%, rgba(10,9,19,1) 73%)" }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start" // Adjusted to move content to the top
            color="white"
            pt={30} // Add some padding at the top
        >
            <Box width="100%" textAlign="center" mb={4}>
            <Box sx={{ alignSelf: 'flex-end' }}>
            <IconButton color="inherit" onClick={handleHomeClick} sx={{ position: 'absolute', top: 10, right: 20 }}>
              <HomeIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
                <Typography variant="h3">Saved Flashcards</Typography>
            </Box>
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    {flashcards.length === 0 ? (
                        <Typography variant="h6" sx={{ color: 'white' }}>No flashcards found</Typography>
                    ) : (
                        flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                                    <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {flashcard.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </Box>
    );
}