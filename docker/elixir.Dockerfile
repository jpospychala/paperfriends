FROM base

MAINTAINER jacek.pospychala@gmail.com

ADD https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb /

RUN TERM=xterm dpkg -i /erlang-solutions_1.0_all.deb; \
    apt-get update; \
    apt-get install esl-erlang elixir --yes; \
    mix local.hex --force; \
