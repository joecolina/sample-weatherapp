# sample-weatherapp
An app featuring HTML, CSS, JS, Node, Express, and APIs that pull current and forecast weather along with images for the query.

**ATTENTION**: In order to run everything properly, generate your own OpenWeather & Unsplash API Keys, and place them in a .env file in the project's root folder (PORT:3000, or another port you choose.)

The previous app version was not considered safe, the APIs were not where they needed to be as there wasn't a proxy. This time around, I used Node.js, Express, bodyParser, and dotenv. APIs are now stored properly, there is now frontend and backend JS to handle the requests, routing, and endpoints. The website's functionality remains the same, just with added security.

ALL previous APIs (Openweather & Unsplash API) and functionality remain, the only major difference is the interactions with Express handling fetch requests.

Other changes include a dummy services module set in a simple CSS Flexbox below the input to "solicit business and generate sales". Added mostly to make the app a little more visually appealing.

The next steps are to possibly implement AWS Lambda for hosting, and AWS Cognito for identity pool authentication.

Some difficulties encountered were POST and GET, (req, res), brackets and parentheses, and some code that would break when formatting and accidentally deleting brackets and parentheses. I'd work through it by utilizing Chrome Inspect and reading various tabs on page load or after input. I also used console.log() to confirm whether or not a certain portion of the code was working.

All resources used to finalize this version:

APIs:
OpenWeatherMap.org API,
Unsplash.com API

Languages/Other:
HTML5,
CSS3,
JavaScript,
Node.js,
Express,
bodyParser,
dotenv

Outside Help:
Google,
YouTube tutorials,
StackOverflow,
reddit,
Discord,
The Odin Project,
freecodecamp,
beautifier.io
