FROM elixir

MAINTAINER jacek.pospychala@gmail.com

RUN apt-get install curl --yes; \
    mix archive.install https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez; \
    curl -sL https://deb.nodesource.com/setup_4.x | bash - ;\
    apt-get install -y nodejs --yes
