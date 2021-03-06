# Development Installation

## Development Environment
A Unix dev environment is recommended because the setup instructions provided are known to work in these environments using a bash terminal.  The instructions may work in a Windows bash terminal but have not been tested.

## Production Environment
A Linux production environment is recommmended, and Ubuntu version 12 and greater is preferred.  A database will be needed and configuration for the database will need to be provided.  See below for database configuration.

The app is not ready for production yet so this part is incomplete.

Assumptions made about production:
- Operating system: Ubuntu 12.04 or greater
- Application will be running in it's own isolated environment, and a virtualenv is not needed.
- Apache httpd server is used to serve app using mod_wsgi.
- All static files are served from Apache using a redirect from url `/static/` to a static documents folder. This folder is created using `python manage.py collectstatic`.  This is not necessary in development.

## Database configuration
Both production and development environments use MySql for a DBMS and require a database configuration specific to the individual environment.
If using mysql 5.7 or greater, a warning may been seen due to strict mode being enable by default.  Turn off strict mode by adding a file named:

`/usr/local/bin/etc/my.cnf`.

To this file add:
```
[mysqld]

sql_mode=NO_ENGINE_SUBSTITUTION
```

#### Development Database
For development, a subset of data is used for testing and provided by ghtorrent [here](http://ghtorrent.org/msr14.html).  Use this link to download the database, and after successful download, unpack the archive to your desired location.  Take note of the location.  The supplied data requires a database to hold so we need to create one using MySql.  The installation of MySql varies on the package manager being used, so it is assumed MySql is installed and running.

Open the MySql interpreter with root access using: `mysql -u root -p`.  If you have a password setup for the root MySql user, you will be prompted to enter it.  Create a database to hold the data by running `create database msr14;`.  This names the databae 'msr'. You can name it however you like.  Create a user for the database by running `create user 'msr14'@'localhost' identified by password;`. The password will need to be added to the local_settings.py file for database connection, and please do not commit the password, or any passwords, to the repository.

The user needs to have access to the database. Run `grant all on msr14.* to 'msr14'@'localhost;`.  After commands have been run successfully, run `quit;` to exit the interpreter.  We can now load the data into the database by running `mysql -u root -p msr14 < path_to_extracted_data_file`.  The `path_to_extracted_data_file` is the absolute path noted earlier, and `msr14` is the name of the database created.  Once this is successful, you can enter the information into the local_settings.py.

Located in the `repo_health` directory of this repository is a `local_settings.py.example` file. Save a copy of this file as `local_settings.py` to the same directory.  Please do not remove the example file from the repo.  If you created the database and user as `msr14` then you will need to insert the password for the user in the `PASSWORD` placeholder.  Otherwise enter the required information into the correct places and save the file.

#### Production Database
Production database is configured in a similar fashion, but the project is not ready for a production setup so this will be revisited.

## Backend Configuration
Python 3.5 is recommended for this project.  It can be downloaded and installed at [python.org](python.org).
Python requirements are kept in the requirements.txt file, and this file is generated using `pip freeze > requirements.txt`.

Developers develop on many projects, and each project has it's own dependencies or deps. For this reason, a virtual environment is created on the developer's machine in order to isolate Python dependencies between projects.  
Virtualenv and virtualenvwrapper are used to create and maintain the environment and need to be installed in the base Python using the pip command line tool.  
An explanation of how to install pip is [here](https://pip.pypa.io/en/stable/installing/), but if you can run `which pip` and see a result, you have pip installed.  
To install virtualenv and virtualenvwrapper use:
  `pip install virtualenv virtualenvwrapper`
and wait for a success message.  If unsuccessful, try the same command using `pip3` in place of `pip`.
Some environment variables need to be set and is explained [here](http://virtualenvwrapper.readthedocs.io/en/latest/install.html), but a bare bones setting is:
- Open up your .bash_profile or .bashrc
- Add the following lines:
   `export WORKON_HOME=$HOME/.envs
   source <(echo which virtualenvwrapper.sh)
   ` 
- Run `source ~/.bash_profile` or `source ~/.bashrc` depending on what file you edited and verify no errors. If an error appears, run `which virtualwrapper.sh` from the terminal and copy the output.  Replace `<(echo which virtualenvwrapper.sh)` in .bash_profile with the output copied.
Once this is configured, you are able to run commands such as `mkvirtualenv`, and `workon` with no errors (maybe a usage message).
To create a virtualenv for our project:
- Run `which python3` and copy the output
- Run `mkvirtualenv <virtualenv name> -p <paste output of previous command>`.  The name of the virtualenv is of your choosing. The name of the project works well.
If this is successful, you will see the command prompt change to begin with `(<virtualenv name>)`.  You are now working inside your virtualenv and running `which python` should result to a path in your `~/.envs` folder.
To stop using the virtualenv, run `deactivate`.
To start using the virtualenv, run `workon <virtualenv name>`.

From inside the virtualenv and in the project root folder, run `pip install -r requirements.txt` to install the deps from the file.
Note for Linux users: `sudo apt-get install libmysqlclient-dev` may need to be ran from the terminal in order for MySQL to be used with the mysqlclient dependency. A mysql_config not found error will be present when running `pip install -r requirements.txt` to signify this.

Once successful, the database is ready to be migrated. Run `python manage.py migrate` to run migrations.

Run `python manage.py runserver` to start the built in dev server, and navigate a browser to [http://localhost:8000](http://localhost:8000) to view the index page.

An admin is available at [http://localhost:8000/admin/](http://localhost:8000/admin/) when the server is running. In order to login to the admin a user will need to be created. Run `python manage.py createsuperuser` and follow the instructions.

Run `python manage.py test` to run the tests.

## Frontend configuration
From project root, `cd repo_health/index/static`.  

Run `npm start` and go to [http://localhost:3000](http://localhost:3000) to view the application.

To run ui tests, run `npm test` in the `repo_health/index/static` folder.

#### Some common commands to help determine what python is being used
- `which python` or `which python3`
  - Shows path python version.
  - The `python3` should display version 3.5 when development is configured correctly.
- `python --version` 
  - Show current version of Python used by the command line command.
