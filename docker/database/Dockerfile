FROM mysql:5.5

RUN mkdir /data
WORKDIR /data

# Install MSR14 database
RUN apt-get update && apt-get install -y curl sed
RUN curl -O https://ghtstorage.blob.core.windows.net/downloads/msr14-mysql.gz
RUN gzip -d msr14-mysql.gz

# Use msr14 for the msr14 script 
RUN echo 'USE msr14;' | cat - msr14-mysql > temp && mv temp msr14-mysql

# We need to move the files to this folder, because they will get run on initialization
RUN mv msr14-mysql /docker-entrypoint-initdb.d/msr-mysql.sql
COPY create_db.sql /docker-entrypoint-initdb.d/

CMD ["/usr/bin/mysqld"]
