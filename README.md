# Backend

### Requirements

- Python version 3.x
- Pip

### Setup

For running the backend, you will need to install pipenv using pip:

```bash
pip install pipenv
```

Afterwards, you use the following command to set up the project:

```bash
pipenv install
```

This will setup the virtual environment and install the used packages.

### Running the model

The run the model, use:

```bash
pipenv run app
```

### Dependency managment

If new packages have been added to the lockfile, use:

```bash
pipenv sync
```

### Adding new packages

For adding new packages use:

```bash
pipenv install <package name>
```

> **Warning**
>
> Do not commit manual changes to the Pipfile.lock

# Frontend

### Requirements

- npm

### Setup

Install the packages using npm:

```bash
npm install -g expo-cli
npm i
```

### Starting the app

```bash
npx expo start
```

> **Hint**
>
> If using the expo go app to test on a phone, if you cannot connect to the app, try starting with `--tunnel`.
