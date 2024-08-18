'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '@/firebase';
import { Button, Box, Container, Paper, TextField, Typography, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
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
    >
      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
          <Box sx={{ alignSelf: 'flex-end' }}>
          <IconButton color="inherit" onClick={handleHomeClick} sx={{ position: 'absolute', top: 10, right: 20 }}>
              <HomeIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
          <Typography variant="h4" gutterBottom>Generate Flashcards</Typography>
          <Paper sx={{ p: 4, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter Text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{ style: { color: 'white' } }}
            />
            <Button variant="contained" color="secondary" onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>Flashcards Preview</Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white'}}>
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
                              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
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
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button fullWidth variant="contained" color="secondary" onClick={handleOpen} sx={{mb: 2}}>
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Container>
      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { backgroundColor: 'rgba(22,22,29,1)', color: 'white' } }}>
        <DialogTitle sx={{ color: 'white' }}>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white', margin: 1}}>Please enter a name for your flashcards collection</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={saveFlashcards} sx={{ color: 'white' }}>Save</Button>
        </DialogActions>
      </Dialog>
      <Box component="footer" sx={{ textAlign: 'center', py: 2, color: 'white' }}>
        <Typography>© 2024 QuikFlash. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}