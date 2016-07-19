FROM ubuntu:16.04

MAINTAINER jacek.pospychala@gmail.com

# Set the locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update; \
    apt-get install curl make --yes; \
