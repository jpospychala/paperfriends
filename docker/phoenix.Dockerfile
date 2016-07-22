FROM elixir

MAINTAINER jacek.pospychala@gmail.com

RUN mix archive.install --force https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez; \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - ;\
    apt-get install -y nodejs --yes
