import express from 'express';

const router = express.Router();

router.post('/register', async (req, res) => {
  // Handle register logic here
  res.sned("register");
});

router.post('/login', async (req, res) => {
    // Handle login logic here
    res.sned("login");
  });

export default router;