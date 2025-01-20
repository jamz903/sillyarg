<h1>SillyArg</h1>

Hi! Welcome to our Hack & Roll 2025 Submission.

Run our project by using the following commands:
```
cd backend
poetry install --no-root
poetry run uvicorn app.main:app --reload
```
```
cd frontend
npm install
npm run dev
```
Do remember to run these in separate terminals, and we require Python 3.13. You will then be able to access our Vite + React application :)

<h1>What Our App Is All About</h1>
SillyArg is a play on the word "Sillage," the trail of scent left in the air by perfume. The two of us often struggle to figure out what scents we like beyond the common ones found in stores like Sephora. So, we decided to create an app that helps people shortlist the top 5 related scents to those that can be commonly found.
Our goal is to make discovering new fragrances easier and more enjoyable, helping users explore options they might never have considered while expanding their scent horizons.

Our App has 3 key features:
1. Perfume Database

We web scraped all the perfumes we could from Sephora using Beautiful Soup & Selenium. The scraped data is then added into MongoDB and displayed on our webpage, together with its fragrance qualities.

2. Specifying Notes

When it comes to perfumes, deciding what notes matter the most to you affects your decision. This is why we allow users to pick if they want to find perfumes most similar to the top, middle or bottom notes.

3. AI Integration

We integrated Gemini to retrieve the Top 5 most popular scents that matches the specified notes and fragrance qualities of the perfume selected.

After the perfumes are generated, you can then easily copy it on your clipboard to save it anywhere you like.

(NOTE: You will have to connect your own MONGODB_URI and API_KEY in an env file.)
