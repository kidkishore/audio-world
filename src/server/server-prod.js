import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.static(DIST_DIR))

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})

// Configure app to use bodyParser()
// This will let us get data from a POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const profile = require( './profile' );
app.use( '/api/profile', profile );

const transcoder = require( './transcoder' );
app.use( '/api/transcoder', transcoder );

const emailer = require( './emailer' );
app.use( '/api/emailer', emailer );

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})