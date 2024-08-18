'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation"
import { Box, Container, Grid, Card, CardActionArea, CardContent, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

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
      justifyContent="flex-start"
      color="white"
      pt={4}
    >
      <Box width="100%" textAlign="center" mb={4}>
      <Box sx={{ alignSelf: 'flex-end' }}>
            <IconButton color="inherit" onClick={handleHomeClick} sx={{ position: 'absolute', top: 10, right: 20 }}>
              <HomeIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        <Typography variant="h3">{search}</Typography>
      </Box>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <CardActionArea onClick={() => handleCardClick(index)}>
                  <CardContent>
                    <Box
                      sx={{
                        perspective: '1000px',
                        '& > div': {
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          position: 'relative',
                          width: '100%',
                          height: '200px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                          transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        },
                        '& > div > div': {
                          position: 'absolute',
                          width: '100%',
                          height: '200px',
                          backfaceVisibility: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 2,
                          boxSizing: 'border-box',
                        },
                        '& > div > div:nth-of-type(2)': {
                          transform: 'rotateY(180deg)',
                        },
                      }}
                    >
                      <div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="h5" component="div">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}