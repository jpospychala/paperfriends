FROM base

MAINTAINER jacek.pospychala@gmail.com

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - ;\
    apt-get install -y nodejs --yes
