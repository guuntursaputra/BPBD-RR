const express = require('express');
const cors = require('cors'); // Import CORS package
const fileUpload = require('express-fileupload');
const path = require('path');

const authRoutes = require('./routes/auth.route');
const bankRoutes = require('./routes/bank.route');
const rakyatRoutes = require('./routes/rakyat.route');
const terminRoutes = require('./routes/termin.route');
const contactRoutes = require('./routes/contact.route');
const structRoutes = require('./routes/struct.route');
const newsRoutes = require('./routes/news.route');
const footerRoutes = require('./routes/footer.route');
const recapRoutes = require('./routes/recap.route');
const aboutRoutes = require('./routes/about.route');
const adminRoutes = require('./routes/admin.route');
const db = require('./config/database');

require('./models/User');
require('./models/Rakyat');
require('./models/Bank');
require('./models/Recap');
require('./models/Termin');
require('./models/TerminNominal');
require('./models/News');
require('./models/Footer');
require('./models/ListContentFooter');
require('./models/Struct');
require('./models/About');
require('./models/Contact');
require('./models/associations');

const app = express();

// Use CORS with specific origin
app.use(cors({
  origin: 'http://localhost:3001', // Replace this with the origin you want to allow
}));

app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 } // Increase file upload limit to 10MB
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Uncomment the following if you need to synchronize the database
// db.sync({ alter: true })
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch((err) => {
//     console.error('Error synchronizing database:', err);
// });

app.use('/admin', adminRoutes);
app.use('/bank', bankRoutes);
app.use('/rakyat', rakyatRoutes);
app.use('/termin', terminRoutes);
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);
app.use('/structs', structRoutes);
app.use('/news', newsRoutes);
app.use('/footers', footerRoutes);
app.use('/recaps', recapRoutes);
app.use('/about', aboutRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
