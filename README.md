# 🏎️ Instant Formula 1 Search with JOINs, powered by Typesense and Django

This is a demo that shows how you can use [Typesense](https://github.com/typesense/typesense), along with [Django](https://www.djangoproject.com/), in order to build a search index with near instant results.

## Tech Stack

The app was built using [Django](https://www.djangoproject.com/), utilizing the [Django REST framework](https://www.django-rest-framework.org/) for the backend, along with the <a href="https://github.com/typesense/typesense-instantsearch-adapter" target="_blank">
Typesense Adapter for instantsearchjs</a>, and a [Vite](https://vitejs.dev/) bundled React frontend, with routing from [React Router](https://reactrouter.com/en/main).

## Development

To run this project locally, check out the `.env.example` file for the environment variables you'll need to configure, install the dependencies and start the Docker image, index the dataset and start the development server.

```shell
# Create the virtual python environment 
python -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the Python dependencies
pip install -r requirements.txt

# Start the docker containers
docker-compose up

# Run the Django migrations
python manage.py migrate

# Source the database
python manage.py source_db

# Index Typesense
python manage.py index_typesense

# Start the Django development server
python manage.py runserver

# In a separate terminal, start the Vite development server
cd frontend

# Install the dependencies
pnpm install

# Start the Vite development server
pnpm run dev
```

Open `http://localhost:3000` to see the app.

You can also access `http://localhost:8000` to access the Django API. For a list of available endpoints, check the `results/urls.py` file.

There's a simple `post_save` and `post_delete` [signal configuration](https://docs.djangoproject.com/en/5.0/ref/signals/#post-save) setup, in order for auto-indexing newly created/updated or deleted records in Typesense.

For more information, please consult the [Typesense Documentation](https://typesense.org/docs/). 

## Credits

The dataset used in this showcase is from  [The Ergast API's](http://ergast.com/mrd/) public dataset of Formula One races.
